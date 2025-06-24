from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, db

class FollowUser(Resource):
    @jwt_required()
    def post(self, user_id):
        current_user = db.session.get(User, get_jwt_identity())
        user_to_follow = db.session.get(User, user_id)

        if not user_to_follow:
            return {"error": "User not found"}, 404
        if user_to_follow.id == current_user.id:
            return {"error": "You cannot follow yourself"}, 400
        if user_to_follow in current_user.following:
            return {"message": "Already following this user"}, 200

        current_user.following.append(user_to_follow)
        db.session.commit()
        return {"message": f"You are now following {user_to_follow.username}"}, 201

class UnfollowUser(Resource):
    @jwt_required()
    def delete(self, user_id):
        current_user = db.session.get(User, get_jwt_identity())
        user_to_unfollow = db.session.get(User, user_id)

        if not user_to_unfollow:
            return {"error": "User not found"}, 404
        if user_to_unfollow not in current_user.following:
            return {"message": "You're not following this user"}, 200

        current_user.following.remove(user_to_unfollow)
        db.session.commit()
        return {"message": f"You unfollowed {user_to_unfollow.username}"}, 200

class FollowingFeed(Resource):
    @jwt_required()
    def get(self):
        user = db.session.get(User, get_jwt_identity())
        reviews = []
        for followed_user in user.following:
            reviews.extend(followed_user.reviews)

        sorted_reviews = sorted(reviews, key=lambda r: r.created_at, reverse=True)
        return [r.to_dict() for r in sorted_reviews], 200
