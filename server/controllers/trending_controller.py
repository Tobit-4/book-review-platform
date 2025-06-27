from datetime import datetime, timedelta
from models import Book, Review
from sqlalchemy import func
from flask_restful import Resource
from flask import jsonify

class TrendingBooks(Resource):
    def get(self):
        try:
            week_ago = datetime.utcnow() - timedelta(days=7)
            
            trending_books = Book.query.join(Review).filter(
                Review.created_at >= week_ago
            ).group_by(Book.id).order_by(
                func.count(Review.id).desc()
            ).limit(10).all()
            
            return [{
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "cover_image_url": book.cover_image_url,
                "average_rating": book.average_rating
            } for book in trending_books], 200
            
        except Exception as e:
            return {"error": "Server error"}, 500
