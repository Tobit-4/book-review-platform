from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from models.bookgenre import BookGenre 

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    published_year = db.Column(db.Integer)
    cover_image_url = db.Column(db.String(255))

    serialize_rules = (
        '-reviews.book',
        '-genre_associations.book',
        ('genres', lambda genres: [g.to_dict(rules=('-books',)) for g in genres]),
    )

    # Relationships
    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan')
    genre_associations = db.relationship('BookGenre', back_populates='book', cascade='all, delete-orphan')
    
    # Association proxy
    genres = association_proxy('genre_associations', 'genre',
                             creator=lambda genre: BookGenre(genre=genre))
    
    @property
    def average_rating(self):
        if not self.reviews:
            return None
        return round(sum(r.rating for r in self.reviews) / len(self.reviews), 2)