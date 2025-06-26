import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FollowingList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/follows/mine', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch following list');
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching following:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  if (loading) {
    return (
      <div className="following-loading">
        <div className="spinner"></div>
        <p>Loading following list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="following-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="following-container">
      <header className="following-header">
        <h2 className="following-title">Users You Follow</h2>
      </header>

      {users.length === 0 ? (
        <div className="following-empty">
          <p>You're not following anyone yet.</p>
          <Link to="/discover" className="discover-link">
            Discover Users
          </Link>
        </div>
      ) : (
        <ul className="following-list">
          {users.map((user) => (
            <li key={user.id} className="following-item">
              <Link to={`/profile/${user.id}`} className="user-link">
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={`${user.username}'s avatar`}
                    className="user-avatar"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                )}
                <div className="user-info">
                  <h3 className="username">{user.username}</h3>
                  {user.bio && <p className="user-bio">{user.bio}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FollowingList;