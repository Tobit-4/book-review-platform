from config import db
from datetime import datetime

class ShelfBook(db.Model):
    __tablename__ = 'user_shelves'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    shelf_id = db.Column(db.Integer, db.ForeignKey('shelves.id'), primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)

    shelf = db.relationship('Shelf', back_populates='book_associations')
    book = db.relationship('Book', back_populates='shelf_associations')
