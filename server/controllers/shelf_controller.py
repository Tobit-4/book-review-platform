from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Shelf, Book, ShelfBook
from flask import request

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, required=True)
parser.add_argument('description', type=str)
parser.add_argument('book_id', type=int)

class ShelfList(Resource):
    @jwt_required()
    def get(self):
        """Get all shelves for current user"""
        user = User.query.get_or_404(get_jwt_identity())
        include_books = request.args.get('include_books', 'false').lower() == 'true'
        return {'shelves': [s.to_dict(include_books=include_books) for s in user.shelves]}, 200

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
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        try:
            # Verify input data
            if not data or 'book_id' not in data:
                return {'message': 'Missing book_id'}, 400

            # Start transaction
            with db.session.begin():
                # Get book and shelf with proper error handling
                book = Book.query.get(data.get('book_id'))
                if not book:
                    return {'message': 'Book not found'}, 404
                
                shelf = Shelf.query.filter_by(
                    id=shelf_id,
                    user_id=current_user_id
                ).first()
                
                if not shelf:
                    return {'message': 'Shelf not found or access denied'}, 404

                # Check for existing association
                existing = ShelfBook.query.filter_by(
                    shelf_id=shelf_id,
                    book_id=book.id,
                    user_id=current_user_id
                ).first()
                
                if existing:
                    return {
                        'message': 'Book already in shelf',
                        'shelf': shelf.to_dict(include_books=True)
                    }, 200

                # Create new association
                new_assoc = ShelfBook(
                    shelf_id=shelf_id,
                    book_id=book.id,
                    user_id=current_user_id
                )
                db.session.add(new_assoc)
                
                
                return {
                    'message': 'Book added to shelf',
                    'shelf': shelf.to_dict(include_books=True)
                }, 201

        except Exception as e:
            db.session.rollback()
            import traceback
            traceback.print_exc()  # 👈 this prints the full error to your terminal
            return {'message': str(e)}, 500  # 👈 return the actual error for now (you can remove later)