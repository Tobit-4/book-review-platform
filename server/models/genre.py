from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from models.bookgenre import BookGenre

class Genre(db.Model, SerializerMixin):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  

    serialize_rules = (
        '-book_associations.genre',
        ('books', lambda books: [b.to_dict(rules=('-genres',)) for b in books]),
    )

    serialize_rules = ('-book_associations',)
    # Relationships
    book_associations = db.relationship('BookGenre', back_populates='genre', cascade='all, delete-orphan')
    
    # Association proxy
    books = association_proxy('book_associations', 'book',
                            creator=lambda book: BookGenre(book=book))