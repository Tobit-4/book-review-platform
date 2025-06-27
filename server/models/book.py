from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from models.bookgenre import BookGenre
from datetime import datetime

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    published_year = db.Column(db.Integer)
    cover_image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan')
    genre_associations = db.relationship('BookGenre', back_populates='book', cascade='all, delete-orphan')
    genres = association_proxy('genre_associations', 'genre', creator=lambda genre: BookGenre(genre=genre))

    shelf_associations = db.relationship('ShelfBook', back_populates='book', cascade='all, delete-orphan')
    shelves = association_proxy('shelf_associations', 'shelf')

    serialize_rules = (
        '-shelves.books',
        '-shelf_associations',
        '-reviews.book',
        '-genre_associations.book',
        '-genres.books',
        '-reviews.user.reviews',
        '-reviews.user.password_hash',
        '-shelf_associations.shelf',
        '-shelf_associations.book'
    )

    @property
    def average_rating(self):
        if not self.reviews:
            return None
        return round(sum(r.rating for r in self.reviews) / len(self.reviews), 2)
    def to_dict(self, include_reviews=False, include_genres=False, include_shelves=False):
        data = {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'published_year': self.published_year,
            'cover_image_url': self.cover_image_url,
            'average_rating': self.average_rating,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_reviews:
            data['reviews'] = [r.to_dict(rules=('-book', '-user.reviews')) for r in self.reviews]
            
        if include_genres:
            data['genres'] = [g.to_dict(rules=('-books',)) for g in self.genres]
            
        if include_shelves:
            data['shelves'] = [s.to_dict(rules=('-books',)) for s in self.shelves]
            
        return data