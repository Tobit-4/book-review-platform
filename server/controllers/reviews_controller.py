from models import Review, db
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

class ReviewResource(Resource):
    @jwt_required()
    def patch(self, review_id):
        current_user_id = get_jwt_identity()
        review = Review.query.get(review_id)
        
        if not review:
            return {'error': 'Review not found'}, 404
        
        if review.user_id != current_user_id:
            return {'error': 'Unauthorized to edit this review'}, 403
        
        data = request.get_json()
        try:
            if 'rating' in data:
                review.rating = data['rating']
            if 'content' in data:
                review.content = data['content']
            
            db.session.commit()
            return review.to_dict(rules=('-user', '-book')), 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

    @jwt_required()
    def delete(self, review_id):
        current_user_id = get_jwt_identity()
        review = Review.query.get(review_id)
        
        if not review:
            return {'error': 'Review not found'}, 404
        
        if review.user_id != current_user_id:
            return {'error': 'Unauthorized to delete this review'}, 403
        
        try:
            db.session.delete(review)
            db.session.commit()
            return {'message': 'Review deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class UserReviewList(Resource): 
    @jwt_required()
    def get(self):
        reviews = Review.query.filter_by(user_id=int(get_jwt_identity())).all()
        return [review.to_dict(rules=('-user.reviews', '-book')) for review in reviews]

    
class ReviewList(Resource):
    @jwt_required()
    def get(self):
        reviews = Review.query.all()
        return [r.to_dict() for r in reviews]
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        
        required_fields = ['book_id', 'rating', 'comment']
        if not all(field in data for field in required_fields):
            return {'error': 'Missing required fields'}, 400
        
        try:
            current_user = int(get_jwt_identity())
            review = Review(
                user_id=current_user,
                book_id=data['book_id'],
                rating=data['rating'],
                comment=data['comment']
            )
            
            db.session.add(review)
            db.session.commit()
            
            return {
                'id': review.id,
                'book_id': review.book_id,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at.isoformat()
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create review'}, 500