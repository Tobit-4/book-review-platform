from .user import User, follows
from .book import Book
from .review import Review
from .genre import Genre
from .bookgenre import BookGenre
from .shelf import Shelf
from .shelf_book import ShelfBook

# SQLAlchemy instance
from config import db

__all__ = ["User", "Book", "Review", "Genre", "BookGenre", "follows", "Shelf", "ShelfBook", "db"]
