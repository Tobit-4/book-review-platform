from flask import request
from flask_restful import Resource
from models import Book, Review, db, Genre, BookGenre
from sqlalchemy import func
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import joinedload

class BookList(Resource):
    def get(self):
        books = Book.query.options(
                joinedload(Book.genre_associations).joinedload(BookGenre.genre)
            ).all()


        return [{
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'description': book.description,
            'cover_image_url': book.cover_image_url,
            'average_rating': book.average_rating,
            'genres': [{'id': g.genre.id, 'name': g.genre.name} for g in book.genre_associations]
        } for book in books]


    @jwt_required()
    def post(self):
        data = request.get_json()

    # Validation
        if not data.get('title') or not data.get('author'):
            return {'error': 'Title and author are required'}, 400

        try:
            # Create book
            book = Book(
                title=data['title'],
                author=data['author'],
                description=data.get('description'),
                published_year=data.get('published_year'),
                cover_image_url=data.get('cover_image_url')
            )

            db.session.add(book)

            # Handle genres
            if 'genres' in data:
                genres = Genre.query.filter(Genre.id.in_(data['genres'])).all()
                if len(genres) != len(data['genres']):
                    return {'error': 'One or more genre IDs are invalid'}, 400
                book.genres = genres

            db.session.commit()

            
            return {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'description': book.description,
                'published_year': book.published_year,
                'cover_image_url': book.cover_image_url,
                'average_rating': book.average_rating,
                'genres': [{'id': g.id, 'name': g.name} for g in book.genres]
            }, 201

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
    
from flask import current_app as app

class BookDetail(Resource):
    def get(self, book_id):
        try:
            book = Book.query.options(
                db.joinedload(Book.reviews).joinedload(Review.user),
                db.joinedload(Book.genre_associations).joinedload(BookGenre.genre)
            ).get(book_id)

            if not book:
                return {'error': 'Book not found'}, 404

           
            return {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'description': book.description,
                'cover_image_url': book.cover_image_url,
                'published_year': book.published_year,
                'average_rating': book.average_rating,
                'genres': [{'id': g.id, 'name': g.name} for g in book.genres],
                'reviews': [{
                    'id': r.id,
                    'rating': r.rating,
                    'comment': r.comment,
                    'user': {
                        'id': r.user.id,
                        'username': r.user.username
                    }
                } for r in book.reviews]
            }, 200

        except Exception as e:
            app.logger.error(f"Error in BookDetail: {str(e)}", exc_info=True)
            return {'error': f'Internal server error: {str(e)}'}, 500

