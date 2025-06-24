from sqlalchemy_serializer import SerializerMixin
from config import db

class BookGenre(db.Model, SerializerMixin):
    __tablename__ = 'book_genres'

    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), nullable=False)
    user_submitted = db.Column(db.Boolean, default=False)

    serialize_rules = (
        '-book.genre_associations',
        '-genre.book_associations',
    )

    # Relationships
    book = db.relationship('Book', back_populates='genre_associations')
    genre = db.relationship('Genre', back_populates='book_associations')