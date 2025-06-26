import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReviewList from './ReviewList'
import ReviewForm from './ReviewForm'
import AddToShelf from './AddToShelf'

function BookDetail({ user }) {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBook = () => {
    setLoading(true)
    fetch(`http://127.0.0.1:5000/bookdetails/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Book not found')
        return res.json()
      })
      .then(setBook)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBook()
  }, [id])

  const handleNewReview = (newReview) => {
    setBook((prevBook) => ({
      ...prevBook,
      reviews: [...prevBook.reviews, newReview],
    }))
  }

  if (error) return <p className="text-red">{error}</p>
  if (loading || !book) return <p>Loading...</p>

  return (
    <div className="container">
      <h1 className="title">{book.title}</h1>
      <p className="author">Author: {book.author}</p>
      <p className="genres">
        Genres: {book.genres.map((g) => g.name).join(', ')}
      </p>
      <p className="description">Description: {book.description || 'No description'}</p>
      <p className="rating">Average Rating: {book.average_rating || 'N/A'}</p>

      <hr className="my-4" />
      <h2 className="reviews">Reviews</h2>
      <ReviewList reviews={book.reviews} />

      {user ? (
        <>
          <hr className="my-4" />
          <h3 className="add-review">Add a Review</h3>
          <ReviewForm bookId={book.id} onReviewSubmit={handleNewReview} />
          <AddToShelf bookId={book.id} />
        </>
      ) : (
        <p className="login-reviews">Login to add a review.</p>
      )}
    </div>
  )
}

export default BookDetail
