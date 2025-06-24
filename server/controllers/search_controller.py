from flask_restful import Resource
from models import Book
from flask import  request

class SearchBooks(Resource):
         def get(self):
                 
            query = request.args.get('query', '').lower()
            results = Book.query.filter(
                Book.title.ilike(f"%{query}%") | Book.author.ilike(f"%{query}%")
            ).all()
            return [b.to_dict() for b in results], 200