import { useState, useEffect } from 'react';

function FollowUser({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/follows/check/${targetUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to check follow status');
        
        const data = await res.json();
        setIsFollowing(data.following);
      } catch (err) {
        setError(err.message);
        console.error('Follow check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [targetUserId]);

  const toggleFollow = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const url = `http://127.0.0.1:5000/follows/${targetUserId}`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}`);
      
      setIsFollowing(!isFollowing);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="follow-error">
        <span className="error-message">{error}</span>
        <button 
          onClick={toggleFollow}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="follow-container">
      <button
        onClick={toggleFollow}
        disabled={isLoading}
        className={`follow-button ${
          isFollowing ? 'follow-button--unfollow' : 'follow-button--follow'
        }`}
        aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
      >
        {isLoading ? (
          <span className="follow-spinner"></span>
        ) : isFollowing ? (
          'Following'
        ) : (
          'Follow'
        )}
      </button>
      
      {error && (
        <p className="follow-error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FollowUser;