from models import Review, db
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

class ReviewResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        review = Review(
            rating=data['rating'],
            comment=data.get('comment'),
            book_id=data['book_id'],
            user_id=get_jwt_identity()  
        )
        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201

    @jwt_required()
    def get(self, review_id):
        review = Review.query.get_or_404(review_id)
        if review.user_id != get_jwt_identity():  
            return {"error": "Unauthorized"}, 403
        return review.to_dict()

    @jwt_required()
    def patch(self, review_id):  
        review = Review.query.get_or_404(review_id)
        if review.user_id != get_jwt_identity():
            return {"error": "Unauthorized"}, 403
            
        data = request.get_json()
        if 'rating' in data:
            review.rating = data['rating']
        if 'comment' in data:
            review.comment = data['comment']
            
        db.session.commit()
        return review.to_dict()

    @jwt_required()
    def delete(self, review_id):
        review = Review.query.get_or_404(review_id)
        if review.user_id != get_jwt_identity():
            return {"error": "Unauthorized"}, 403
            
        db.session.delete(review)
        db.session.commit()
        return {"message": "Review deleted successfully"}, 200

class UserReviewList(Resource): 
    @jwt_required()
    def get(self):
        reviews = Review.query.filter_by(user_id=get_jwt_identity()).all()
        return [review.to_dict() for review in reviews]

    
        