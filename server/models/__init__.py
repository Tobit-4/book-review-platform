from .user import User, follows
from .book import Book
from .review import Review
from .genre import Genre
from .bookgenre import BookGenre

# SQLAlchemy instance
from config import db

__all__ = ["User", "Book", "Review", "Genre", "BookGenre", "follows", "db"]
