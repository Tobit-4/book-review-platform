import requests
from app import app, db
from models import User, Book, Genre, Review, Shelf, ShelfBook
from werkzeug.security import generate_password_hash
from random import randint, choice, sample
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text

user_data = [
    {"username": "alice", "email": "alice@example.com", "password": "password123"},
    {"username": "bob", "email": "bob@example.com", "password": "password123"},
    {"username": "carol", "email": "carol@example.com", "password": "password123"}
]

genres_data = ["Fantasy", "Science Fiction", "Mystery", "Non-Fiction", "Romance"]

shelf_data = [
    {"name": "Currently Reading", "description": "Books I'm currently enjoying"},
    {"name": "Want to Read", "description": "My reading wishlist"},
    {"name": "Favorites", "description": "All-time favorite books"}
]

def fetch_google_books(query="fiction", max_results=10):
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults={max_results}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        return res.json().get("items", [])
    except requests.RequestException as e:
        print(f"Error fetching books from Google API: {e}")
        return []

def get_unique_books(books, count):
    """Get unique random books ensuring no duplicates"""
    if count > len(books):
        count = len(books)
    return sample(books, count)

def seed_database():
    with app.app_context():
        try:
            print("🔁 Resetting database...")
            db.drop_all()
            db.create_all()

            # Create users
            print("👥 Creating users...")
            users = []
            for data in user_data:
                try:
                    user = User(
                        username=data["username"],
                        email=data["email"],
                        password_hash=generate_password_hash(data["password"])
                    )
                    db.session.add(user)
                    db.session.flush()
                    users.append(user)
                    print(f"  ✓ Created user: {user.username}")
                except IntegrityError as e:
                    db.session.rollback()
                    print(f"  ✗ Error creating user {data['username']}: {e}")
                    continue
            db.session.commit()

            # Create genres
            print("📚 Creating genres...")
            genres = []
            for name in genres_data:
                genre = Genre(name=name)
                db.session.add(genre)
                genres.append(genre)
                print(f"  ✓ Created genre: {name}")
            db.session.commit()

            # Create books
            print("📖 Fetching and creating books...")
            books = []
            google_books = fetch_google_books("bestsellers", 15)
            for i, item in enumerate(google_books, 1):
                info = item.get("volumeInfo", {})
                title = info.get("title", f"Untitled Book {i}").strip()
                authors = info.get("authors", ["Unknown Author"])
                
                if not title or not authors:
                    continue

                book = Book(
                    title=title,
                    author=authors[0],
                    description=info.get("description", f"A book titled {title}"),
                    published_year=int(info.get("publishedDate", "2000")[:4]),
                    cover_image_url=info.get("imageLinks", {}).get("thumbnail", "https://via.placeholder.com/150")
                )
                book.genres = sample(genres, min(randint(1, 2), len(genres)))
                db.session.add(book)
                books.append(book)
                print(f"  ✓ Created book: {title} by {authors[0]}")
                
                if i % 5 == 0:
                    db.session.commit()
            db.session.commit()

            # Create shelves with books
            print("🗄️ Creating shelves...")
            for user in users:
                for shelf_info in shelf_data:
                    shelf = Shelf(
                        name=f"{user.username}'s {shelf_info['name']}",
                        description=shelf_info["description"],
                        user=user
                    )
                    db.session.add(shelf)
                    db.session.flush()
                    
                    selected_books = sample(books, min(randint(2, 4), len(books)))
                    for book in selected_books:
                        db.session.flush()
                        sb = ShelfBook(
                            user_id=user.id,
                            shelf_id=shelf.id,
                            book_id=book.id,
                            created_at=datetime.utcnow()
                        )
                        db.session.add(sb)
                    
                    print(f"  ✓ Created shelf '{shelf.name}' with {len(selected_books)} books")
                db.session.commit()

            # Create reviews
            print("🌟 Creating reviews...")
            for book in books:
                for user in users:
                    if randint(0, 1):
                        review = Review(
                            rating=randint(2, 5),
                            comment=f"{user.username}'s opinion on {book.title}",
                            user_id=user.id,
                            book_id=book.id,
                            created_at=datetime.utcnow()
                        )
                        db.session.add(review)
            db.session.commit()

            print("\n✅ Database seeded successfully!")
            print(f"• Users: {len(users)}")
            print(f"• Books: {len(books)}")
            print(f"• Shelves: {len(shelf_data)*len(users)}")
            print(f"• Reviews: {Review.query.count()}")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error seeding database: {e}")
            raise

if __name__ == '__main__':
    seed_database()