from app import app
from models import db, User, Book, Genre, Review
from werkzeug.security import generate_password_hash
from random import randint, choice

# Sample data
user_data = [
    {"username": "alice", "email": "alice@example.com", "password": "password123"},
    {"username": "bob", "email": "bob@example.com", "password": "password123"},
    {"username": "carol", "email": "carol@example.com", "password": "password123"}
]

genres_data = ["Fantasy", "Science Fiction", "Mystery", "Non-Fiction", "Romance"]

books_data = [
    {"title": "The Alchemist", "author": "Paulo Coelho"},
    {"title": "Dune", "author": "Frank Herbert"},
    {"title": "Sherlock Holmes", "author": "Arthur Conan Doyle"},
    {"title": "Sapiens", "author": "Yuval Noah Harari"},
    {"title": "Pride and Prejudice", "author": "Jane Austen"}
]

with app.app_context():

    db.drop_all()
    db.create_all()

    # users
    users = []
    for data in user_data:
        user = User(
            username=data["username"],
            email=data["email"],
            password_hash=generate_password_hash(data["password"])
        )
        db.session.add(user)
        users.append(user)

    # genres
    genres = []
    for name in genres_data:
        genre = Genre(name=name)
        db.session.add(genre)
        genres.append(genre)

    # books and random genres
    books = []
    for data in books_data:
        book = Book(
            title=data["title"],
            author=data["author"],
            description=f"A fascinating book called {data['title']}",
            published_year=randint(1950, 2020),
            cover_image_url="https://via.placeholder.com/150"
        )
        # random genres
        book.genres = [choice(genres) for _ in range(randint(1, 3))]
        db.session.add(book)
        books.append(book)

    # reviews
    for book in books:
        for user in users:
            if randint(0, 1):  
                review = Review(
                    rating=randint(1, 5),
                    comment=f"{user.username}'s thoughts on {book.title}",
                    user=user,
                    book=book
                )
                db.session.add(review)

    # follow relationships
    users[0].following.append(users[1])  # follows bob
    users[1].following.append(users[2])  # follows carol

    db.session.commit()
    print("✅ Database seeded successfully!")
