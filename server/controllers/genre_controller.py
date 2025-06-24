from models import db,Genre, Book, BookGenre
from flask_restful import Resource
from flask import request

class GenreBooks(Resource):
    def get(self, genre_id):
        genre = db.session.get(Genre, genre_id)
        if not genre:
            return {"error": "Genre not found"}, 404
        return {
            "genre": genre.name,
            "books": [b.to_dict() for b in genre.books]
        }, 200
    
class GenreList(Resource):
    def get(self):
        genres = Genre.query.all()
        return [g.to_dict() for g in genres]
    
    def post(self):
        data = request.get_json()
        genre = Genre(name=data['name'])
        db.session.add(genre)
        db.session.commit()
        return genre.to_dict(), 201
    
class GenreApi(Resource):
    def get(self, genre_id):
        genre = Genre.query.get_or_404(genre_id)
        return {
            'genre': genre.to_dict(),
            'books': [b.to_dict(rules=(
                '-genres',
                '-reviews',
                {'genres': {'only': ('id', 'name')}}
            )) for b in genre.books]
        }