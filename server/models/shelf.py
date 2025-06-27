from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from models.shelf_book import ShelfBook

class Shelf(db.Model, SerializerMixin):
    __tablename__ = 'shelves'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='shelves')
    book_associations = db.relationship('ShelfBook', back_populates='shelf', cascade='all, delete-orphan', lazy='joined')
    books = association_proxy('book_associations', 'book')

    serialize_rules = ('-user.shelves', '-books.shelves')

    def to_dict(self, include_books=False):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'book_count': len(self.books),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_books:
            data['books'] = [{
                'id': assoc.book.id,
                'title': assoc.book.title,
                'author': assoc.book.author,
                'added_at': assoc.created_at.isoformat()
            } for assoc in self.book_associations]

        return data


    def get_book_added_time(self, book_id):
        assoc = next((a for a in self.book_associations if a.book_id == book_id), None)
        return assoc.created_at.isoformat() if assoc else None
    
    def add_book(self, book, user_id):
        # Check if book already in shelf
        existing = ShelfBook.query.filter_by(
            shelf_id=self.id,
            book_id=book.id,
            user_id=user_id
        ).first()
        
        if existing:
            return False
            
        new_entry = ShelfBook(
            shelf_id=self.id,
            book_id=book.id,
            user_id=user_id
        )
        db.session.add(new_entry)
        db.session.commit()
        return True
