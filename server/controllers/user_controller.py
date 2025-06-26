from flask_restful import Resource
from models import User, Review, db
from flask_jwt_extended import jwt_required, get_jwt_identity

class CurrentUser(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        return user.to_dict(), 200
    
class UserReviews(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        reviews = Review.query.filter_by(user_id = user_id).all()

        return [ r.to_dict() for r in reviews], 200