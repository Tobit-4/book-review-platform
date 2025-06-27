from models import db,Genre
from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required

class GenreBooks(Resource):
    def get(self, genre_id):
        genre = db.session.get(Genre, genre_id)
        if not genre:
            return {"error": "Genre not found"}, 404
        return {
            "genre": {
                'id':genre.id,
                'name':genre.name
            },
            "books": [{
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url,
                "average_rating": book.average_rating 
            } for book in genre.books]
        }, 200

    
class GenreList(Resource):
    def get(self):
        genres = Genre.query.all()
        return [ g.to_dict(rules=(
            '-books',
            '-book_associations')) 
            for g in genres]
    
    @jwt_required()
    def post(self):
        data = request.get_json()

        if not data.get('name'):
            return {"error": "Genre name is required"}, 400
            
        if Genre.query.filter_by(name=data['name']).first():
            return {"error": "Genre already exists"}, 409

        genre = Genre(name=data['name'])
        db.session.add(genre)
        db.session.commit()
        return genre.to_dict(), 201
    