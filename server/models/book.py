from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from models.bookgenre import BookGenre

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    published_year = db.Column(db.Integer)
    cover_image_url = db.Column(db.String(255))

    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan')
    genre_associations = db.relationship('BookGenre', back_populates='book', cascade='all, delete-orphan')
    genres = association_proxy('genre_associations', 'genre', creator=lambda genre: BookGenre(genre=genre))

    shelf_associations = db.relationship('ShelfBook', back_populates='book', cascade='all, delete-orphan')
    shelves = association_proxy('shelf_associations', 'shelf')

    serialize_rules = (
        '-shelves.books',
        '-reviews.book',
        '-genre_associations.book',
        '-genres.books',
        '-reviews.user.reviews',
        '-reviews.user.password_hash'
    )

    @property
    def average_rating(self):
        if not self.reviews:
            return None
        return round(sum(r.rating for r in self.reviews) / len(self.reviews), 2)
