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
            "books": [b.to_dict(rules=(
                '-genres',
                '-reviews',
                '-genre_associations')) for b in genre.books]
        }, 200
    
class GenreList(Resource):
    def get(self):
        genres = Genre.query.all()
        return [ g.to_dict(rules=(
            '-books',
            '-book_associations')) 
            for g in genres]
    
    def post(self):
        data = request.get_json()
        genre = Genre(name=data['name'])
        db.session.add(genre)
        db.session.commit()
        return genre.to_dict(), 201
    