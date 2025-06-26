import React, { useEffect, useState } from 'react'

function MyReviews({ token }) {
  const [reviews, setReviews] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ rating: '', comment: '' })

  useEffect(() => {
    fetch('http://127.0.0.1:5000/myreviews', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setReviews(data))
  }, [token])

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setReviews((prev) => prev.filter((r) => r.id !== id))
    })
  }

  const handleEdit = (review) => {
    setEditing(review.id)
    setFormData({ rating: review.rating, comment: review.comment })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(`http://127.0.0.1:5000/reviews/${editing}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((updated) => {
        setReviews((prev) =>
          prev.map((r) => (r.id === editing ? updated : r))
        )
        setEditing(null)
        setFormData({ rating: '', comment: '' })
      })
  }

  return (
    <div className="my-reviews-page p-4">
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="italic text-gray-500">You haven’t submitted any reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border p-3 rounded shadow">
              <p><strong>Book ID:</strong> {review.book_id}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <form onSubmit={handleSubmit} className="mt-6 border-t pt-4 space-y-3">
          <h3 className="text-lg font-semibold">Edit Review</h3>
          <div>
            <label className="block">Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="border p-1 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block">Comment:</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="border p-1 rounded w-full"
              rows="3"
              required
            />
          </div>
          <div className="space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default MyReviews
