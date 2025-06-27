from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Shelf, Book
from datetime import datetime

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, required=True)
parser.add_argument('description', type=str)
parser.add_argument('book_id', type=int)

class ShelfList(Resource):
    @jwt_required()
    def get(self):
        """Get all shelves for current user"""
        user = User.query.get_or_404(get_jwt_identity())
        return {'shelves': [s.to_dict() for s in user.shelves]}, 200

    @jwt_required()
    def post(self):
        """Create new shelf"""
        args = parser.parse_args()
        user = User.query.get_or_404(get_jwt_identity())
        
        shelf = Shelf(
            name=args['name'],
            description=args.get('description'),
            user=user
        )
        
        db.session.add(shelf)
        db.session.commit()
        
        return shelf.to_dict(), 201

class ShelfDetail(Resource):
    @jwt_required()
    def get(self, shelf_id):
        """Get shelf details with books"""
        shelf = Shelf.query.filter_by(
            id=shelf_id,
            user_id=get_jwt_identity()
        ).first_or_404()
        return shelf.to_dict(include_books=True), 200

    @jwt_required()
    def patch(self, shelf_id):
        """Update shelf metadata"""
        args = parser.parse_args()
        shelf = Shelf.query.filter_by(
            id=shelf_id,
            user_id=get_jwt_identity()
        ).first_or_404()
        
        if args['name']:
            shelf.name = args['name']
        if args.get('description'):
            shelf.description = args['description']
            
        db.session.commit()
        return shelf.to_dict(), 200

    @jwt_required()
    def delete(self, shelf_id):
        """Delete shelf"""
        shelf = Shelf.query.filter_by(
            id=shelf_id,
            user_id=get_jwt_identity()
        ).first_or_404()
        
        db.session.delete(shelf)
        db.session.commit()
        return {'message': 'Shelf deleted'}, 200

class ShelfBooks(Resource):
    @jwt_required()
    def post(self, shelf_id):
        """Add book to shelf"""
        args = parser.parse_args()
        shelf = Shelf.query.filter_by(
            id=shelf_id,
            user_id=get_jwt_identity()
        ).first_or_404()
        
        book = Book.query.get_or_404(args['book_id'])
        
        # Check if book already in shelf
        if book in shelf.books:
            return {'message': 'Book already in shelf'}, 200
            
        shelf.books.append(book)
        db.session.commit()
        return {'message': 'Book added to shelf'}, 201

    @jwt_required()
    def delete(self, shelf_id, book_id):
        """Remove book from shelf"""
        shelf = Shelf.query.filter_by(
            id=shelf_id,
            user_id=get_jwt_identity()
        ).first_or_404()
        
        book = Book.query.get_or_404(book_id)
        
        if book not in shelf.books:
            return {'message': 'Book not in shelf'}, 404
            
        shelf.books.remove(book)
        db.session.commit()
        return {'message': 'Book removed from shelf'}, 200

    def options(self, shelf_id=None, book_id=None):
        return {'Allow': 'GET,POST,DELETE,OPTIONS'}, 200