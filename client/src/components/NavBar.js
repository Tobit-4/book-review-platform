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
      <form
        className="navbar-search-form"
        onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.search.value.trim();
            if (query) window.location.href = `/search?query=${encodeURIComponent(query)}`;
        }}
        >
        <input
            type="text"
            name="search"
            placeholder="Search books..."
            className="navbar-search-input"
        />
        <button type="submit" className="navbar-search-button">Search</button>
    </form>
    </nav>
  );
}

export default NavBar;