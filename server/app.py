from flask import request,make_response,jsonify
from flask_restful import Resource,Api


# Local imports
from config import app, db, api
# Add your model imports
from models import *
from controllers import *


# Views go here!
@app.route('/')
def index():
    return '<h1>Welcome</h1>'

# auth
api.add_resource(SignUp, '/signup')
api.add_resource(Login, '/login')

# Users
api.add_resource(CurrentUser, "/me")


# books
api.add_resource(BookList, '/booklist')
api.add_resource(BookDetail, '/bookdetails/<int:book_id>')

# reviews
api.add_resource(ReviewList, '/reviews')  # POST and optional GET
api.add_resource(ReviewResource, '/reviews/<int:review_id>')  # GET, PATCH, DELETE
api.add_resource(UserReviewList, '/myreviews')  # current user reviews


# genres
api.add_resource(GenreList, '/genres')
api.add_resource(GenreBooks, '/genres/<int:genre_id>/books')

# Search 
api.add_resource(SearchBooks, '/books/search')

# trends
api.add_resource(TrendingBooks, '/books/trending')

# Follow System
api.add_resource(FollowUser, '/follow/<int:user_id>')
api.add_resource(UnfollowUser, '/unfollow/<int:user_id>')
api.add_resource(FollowingFeed, '/feed')

# Shelves
api.add_resource(ReadingList, '/shelf')

if __name__ == '__main__':
    app.run(port=5555, debug=True)