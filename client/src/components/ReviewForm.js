import React, { useState } from 'react'

function ReviewForm({ bookId, onReviewSubmit }) {
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId, rating, comment }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      const newReview = await res.json()
      onReviewSubmit(newReview)
      setRating('')
      setComment('')
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2 book-form">
      <h3 className="book-form__title">Leave a Review</h3>

      {error && (
        <p className="book-form__message book-form__message--error">{error}</p>
      )}

      <div className="book-form__field">
        <label className="book-form__label">Rating (1–5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          className="book-form__input"
        />
      </div>

      <div className="book-form__field">
        <label className="book-form__label">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="book-form__textarea"
          rows="4"
        />
      </div>

      <button type="submit" className="book-form__submit">
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm
