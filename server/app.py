from flask_cors import CORS
from sqlalchemy import text

# Local imports
from config import app, db, api
# Add your model imports
from models import *
from controllers import *
CORS(app, 
     resources={
         r"/*": {
             "origins": ['https://frontend-vbai.onrender.com',
                        "http://localhost:3000"
                        ],
             "methods": ["GET", "POST", "PUT", "PATCH", "DELETE","OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }
     })


# Views go here!
@app.route('/')
def index():
    return '<h1>Welcome</h1>'

@app.route('/db-check')
def db_check():
    try:
        db.session.execute(text("SELECT 1"))
        return {"database": "connected"}, 200
    except Exception as e:
        return {"database": str(e)}, 500

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

# Shelves
api.add_resource(ShelfList, '/shelves')
api.add_resource(ShelfDetail, '/shelves/<int:shelf_id>')
api.add_resource(ShelfBooks, 
                '/shelves/<int:shelf_id>/books',
                '/shelves/<int:shelf_id>/books/<int:book_id>')

if __name__ == '__main__':
    app.run(port=5000, debug=True)