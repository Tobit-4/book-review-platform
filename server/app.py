#!/usr/bin/env python3

# Standard library imports

# Remote library imports
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

# books
api.add_resource(BookList, '/booklist')
api.add_resource(BookDetail, '/bookdetails')

# reviews
api.add_resource(Review, '/reviews', '/reviews/<int:review_id>')
api.add_resource(UserReviews, '/reviews/<int:review_id>')

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

