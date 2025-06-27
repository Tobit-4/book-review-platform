import { useState, useEffect } from 'react';

function FollowUser({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!targetUserId) return;

    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`/follows/check/${targetUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to check follow status');

        const data = await res.json();
        setIsFollowing(data.isFollowing); // Changed from 'following' to 'isFollowing'
      } catch (err) {
        setError(err.message);
        console.error('Follow check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [targetUserId]);

    // Toggle follow/unfollow
    const toggleFollow = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
          const endpoint = isFollowing 
            ? `/unfollow/${targetUserId}`
            : `/follow/${targetUserId}`;
    
          const res = await fetch(endpoint, {
            method: isFollowing ? 'DELETE' : 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
    
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to ${isFollowing ? 'unfollow' : 'follow'}`);
          }
    
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
        <button onClick={toggleFollow} className="retry-button">
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
          <span className="follow-spinner">Loading...</span>
        ) : isFollowing ? (
          'Following'
        ) : (
          'Follow'
        )}
      </button>
    </div>
  );
}

export default FollowUser;