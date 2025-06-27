from sqlalchemy_serializer import SerializerMixin
from config import db
from datetime import datetime

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    __table_args__ = (
    db.CheckConstraint('rating >= 1 AND rating <= 5', name='rating_bounds'),
)

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    serialize_rules = (
        '-user.reviews',
        '-book.reviews',
        '-user.password_hash',
    )

    # Foreign Keys 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))

    # Relationships
    user = db.relationship('User', back_populates='reviews')
    book = db.relationship('Book', back_populates='reviews')