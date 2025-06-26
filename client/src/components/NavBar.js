import { Link, useNavigate } from 'react-router-dom'

function NavBar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {user && (
          <>
            <Link to="/myreviews" className="hover:underline">
              My Reviews
            </Link>
            <Link to="/shelves" className="hover:underline">
              My Shelves
            </Link>
            <Link to="/follows" className="hover:underline">
              Follows
            </Link>
            <Link to="/trending" className="hover:underline">
              Trending
            </Link>
          </>
        )}
      </div>

      <div className="space-x-3">
        {user ? (
          <>
            <span className="text-sm">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
