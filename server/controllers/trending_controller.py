from datetime import datetime, timedelta
from models import Book, Review
from sqlalchemy import func
from flask_restful import Resource

class TrendingBooks(Resource):
    def get(self):
        week_ago = datetime.utcnow() - timedelta(days=7)
        trending_books = (
            Book.query
            .join(Review)
            .filter(Review.created_at >= week_ago)
            .group_by(Book.id)
            .order_by(func.count(Review.id).desc())
            .limit(10)
            .all()
        )
        return [ r.to_dict() for r in trending_books ]