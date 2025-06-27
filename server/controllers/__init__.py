from .auth_controller import SignUp, Login
from .book_controller import BookList, BookDetail
from .reviews_controller import ReviewResource,ReviewList,UserReviewList
from .user_controller import CurrentUser, UserReviews
from .genre_controller import GenreList, GenreBooks
from .search_controller import SearchBooks
from .trending_controller import TrendingBooks
from .shelf_controller import ShelfList, ShelfBooks, ShelfDetail

__all__ = [
    "SignUp", "Login",
    "BookList", "BookDetail",
    "ReviewResource","ReviewList","UserReviewList",
    "CurrentUser", "UserReviews",
    "GenreList", "GenreBooks",
    "SearchBooks",
    "TrendingBooks",
    "ShelfList","ShelfBooks", "ShelfDetail",
]
