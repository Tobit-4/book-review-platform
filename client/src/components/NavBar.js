import { Link } from 'react-router-dom';

function NavBar({ user, setUser, onLogout }) {
  

  return (
    <nav className='nav-bar'>
      <div className='nav'>
        <Link to="/" className="home">
          Home
        </Link>
        {user && (
          <>
            <Link to='/booklist' className='booklist'>
              booklists
            </Link>
            <Link to="/myreviews" className="reviews">
              My Reviews
            </Link>
            <Link to="/shelves" className="shelves">
              My Shelves
            </Link>
            <Link to="/follows" className="followers">
              Follows
            </Link>
            <Link to="/trending" className="trending">
              Trending Books
            </Link>
          </>
        )}
      </div>

      <div className="user">
        {user ? (
          <>
            <span className="user-name">Hi, {user.username}</span>
            <button
              onClick={onLogout}
              className="log-out"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="sign-up"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;