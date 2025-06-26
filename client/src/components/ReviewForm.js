import React, { useState } from 'react';

function ReviewForm({ bookId, onReviewSubmit }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId, rating, comment }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const newReview = await res.json();
      onReviewSubmit(newReview);
      setRating('');
      setComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>Rating (1–5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={e => setRating(e.target.value)}
        required
      />
      <br />
      <label>Comment:</label>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        required
      />
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
