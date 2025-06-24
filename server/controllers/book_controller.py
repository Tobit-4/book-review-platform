from flask import request, make_response, jsonify
from flask_restful import Resource
from models import Book, Review, db, BookGenre, Genre
from sqlalchemy import func
from flask_jwt_extended import jwt_required

class BookList(Resource):
    def get(self):
        books = Book.query.all()
        return [ b.to_dict(rules=('-genre_associations',)) for b in books ]

    @jwt_required()
    def post(self):
        data = request.get_json()

        if not data.get('title') or not data.get('author'):
            return {'error': 'Title and author are required'}, 400
        
        book = Book(
            title = data['title'],
            author = data['author'],
            description = data.get('description'),
            published_year = data.get('published_year'),
            cover_image_url = data.get('cover_image_url')
        )

        db.session.add(book)

        if 'genres' in data:
            try:
                book.genres = data['genres'] 
            except Exception as e:
                db.session.rollback()
                return {'error': str(e)}, 400
        db.session.commit()
        return book.to_dict(), 201
    
class BookDetail(Resource):
    def get(self, book_id):
        book_by_id = Book.query.get(book_id)

        if not book_by_id:
            return {"error":"Book not found"}, 404
        reviews = Review.query.filter_by(book_id = book_id).all()

        return {
            'book':book_by_id.to_dict(),
            'reviews':[r.to_dict(rules=(
                '-book',
                '-user.reviews',
                '-user.password_hash'
            )) for r in reviews],
            'genres':[g.to_dict(rules=('-books', '-book_associations')) for g in book_by_id.genres]
        }, 200

