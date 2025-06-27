import React, { useEffect, useState } from 'react';
import BookCard from './BookCard'; // Assuming you have a BookCard component

function MyReviews({ token }) {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ rating: '', comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/myreviews', {
            credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/reviews/${id}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete review');
      
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (review) => {
    setEditing(review.id);
    setFormData({ rating: review.rating, comment: review.comment });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/reviews/${editing}`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update review');
      
      const updated = await response.json();
      setReviews((prev) => prev.map((r) => (r.id === editing ? updated : r)));
      setEditing(null);
      setFormData({ rating: '', comment: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="spinner"></div>
        <p>Loading your reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-error">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <header className="reviews-header">
        <h2 className="reviews-title">My Reviews</h2>
      </header>

      {reviews.length === 0 ? (
        <div className="reviews-empty">
          <p>You haven't submitted any reviews yet.</p>
        </div>
      ) : (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              {review.book && <BookCard book={review.book} />}
              
              <div className="review-content">
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < review.rating ? 'filled' : ''}`}
                    >
                      {i < review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                
                {review.comment && (
                  <blockquote className="review-comment">
                    "{review.comment}"
                  </blockquote>
                )}
                
                <div className="review-actions">
                  <button
                    onClick={() => handleEdit(review)}
                    className="review-edit"
                    aria-label="Edit review"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="review-delete"
                    aria-label="Delete review"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <form onSubmit={handleSubmit} className="review-edit-form">
          <h3 className="edit-form-title">Edit Review</h3>
          
          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating (1-5):
            </label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((num) => (
                <React.Fragment key={num}>
                  <input
                    type="radio"
                    id={`star-${num}`}
                    name="rating"
                    value={num}
                    checked={Number(formData.rating) === num}
                    onChange={() => setFormData({ ...formData, rating: num })}
                    className="rating-radio"
                  />
                  <label htmlFor={`star-${num}`} className="rating-label">
                    ★
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="comment" className="form-label">
              Comment:
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="form-textarea"
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="form-submit">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="form-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MyReviews;