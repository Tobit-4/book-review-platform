from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Book
from flask import request

user_shelves = db.Table(
    'user_shelves',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'))
)

User.shelf = db.relationship(
    'Book',
    secondary=user_shelves,
    backref='users_on_shelves'
)

class ReadingList(Resource):
    @jwt_required()
    def get(self):
        user = db.session.get(User, get_jwt_identity())
        return [b.to_dict() for b in user.shelf], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        book_id = data.get('book_id')
        user = db.session.get(User, get_jwt_identity())
        book = db.session.get(Book, book_id)
        if not book:
            return {"error": "Book not found"}, 404
        user.shelf.append(book)
        db.session.commit()
        return {"message": "Book added to shelf"}, 201
''