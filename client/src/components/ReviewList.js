import React from 'react';

function ReviewList({ reviews }) {
  if (!reviews.length) return <p>No reviews yet.</p>;

  return (
    <div>
      <h3>Reviews</h3>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <strong>{review.user.username}:</strong> {review.comment} (Rating: {review.rating})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewList;
