from config import db
from datetime import datetime

class ShelfBook(db.Model):
    __tablename__ = 'shelf_books'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    shelf_id = db.Column(db.Integer, db.ForeignKey('shelves.id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'shelf_id', 'book_id', name='_user_shelf_book_uc'),
    )

    shelf = db.relationship('Shelf', back_populates='book_associations')
    book = db.relationship('Book', back_populates='shelf_associations')

    serialize_rules = ('-shelf', '-book.shelf_associations')
