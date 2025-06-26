import requests
from app import app
from models import db, User, Book, Genre, Review
from werkzeug.security import generate_password_hash
from random import randint, choice

user_data = [
    {"username": "alice", "email": "alice@example.com", "password": "password123"},
    {"username": "bob", "email": "bob@example.com", "password": "password123"},
    {"username": "carol", "email": "carol@example.com", "password": "password123"}
]

genres_data = ["Fantasy", "Science Fiction", "Mystery", "Non-Fiction", "Romance"]

def fetch_google_books(query="fiction", max_results=10):
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults={max_results}"
    res = requests.get(url)
    res.raise_for_status()
    return res.json().get("items", [])

with app.app_context():
    db.drop_all()
    db.create_all()

    # Users
    users = []
    for data in user_data:
        user = User(
            username=data["username"],
            email=data["email"],
            password_hash=generate_password_hash(data["password"])
        )
        db.session.add(user)
        users.append(user)

    # Genres
    genres = []
    for name in genres_data:
        genre = Genre(name=name)
        db.session.add(genre)
        genres.append(genre)

    # Fetch books from Google API
    google_books = fetch_google_books("bestsellers", 15)
    books = []
    for item in google_books:
        info = item.get("volumeInfo", {})
        title = info.get("title")
        authors = info.get("authors", [])
        cover = info.get("imageLinks", {}).get("thumbnail")
        categories = info.get("categories", [])

        if not title or not authors:
            continue

        book = Book(
            title=title,
            author=authors[0],
            description=info.get("description", f"A book titled {title}"),
            published_year=int(info.get("publishedDate", "2000")[:4]),
            cover_image_url=cover or "https://via.placeholder.com/150"
        )
        # Add random genres
        book.genres = [choice(genres) for _ in range(randint(1, 2))]
        db.session.add(book)
        books.append(book)

    # Reviews
    for book in books:
        for user in users:
            if randint(0, 1):
                review = Review(
                    rating=randint(2, 5),
                    comment=f"{user.username}'s opinion on {book.title}",
                    user=user,
                    book=book
                )
                db.session.add(review)

    # Follows
    users[0].following.append(users[1])
    users[1].following.append(users[2])

    db.session.commit()
    print("✅ Database seeded with Google Books!")
