from models import Review, db
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

class Review(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()

        review = Review(
            rating = data['rating'],
            comment = data.get('comment'),
            book_id = data['book_id'],
            user_id = user_id
        )
        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201
    @jwt_required()
    def get(self, review_id):
        review = Review.query.get(review_id)
        user_id = jwt_required()

        if review.user_id != user_id:
            return {"error": "Unauthorised"}, 403
        
        data = request.get_json()
        if 'rating' in data:
            review.rating = data['rating']
        if 'comment' in data:
            review.comment = data['comment']

        db.session.commit()
        return review.to_dict(), 201
    @jwt_required()
    def delete(self, review_id):
        review = Review.query.get(review_id)
        user_id = jwt_required()

        if review.user_id != user_id:
            return {"error": "Unauthorised"}, 403
        
        db.session.delete(review)
        db.session.commit()
        return {"Message": "Review deleted"}, 200
    
class UserReviews(Resource):
    @jwt_required()
    def get(self, review_id):
        review = Review.query.get_or_404(review_id)
        return review.to_dict()  
    

    
        