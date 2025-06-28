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

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true)
      try {
        const response = await fetch(`https://backend-h5uy.onrender.com/bookdetails/${id}`)
        if (!response.ok) throw new Error('Book not found')
        const data = await response.json()
        setBook(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBook()
  }, [id]) // Only id as dependency

  const handleNewReview = (newReview) => {
    setBook(prev => ({
      ...prev,
      reviews: [...prev.reviews, newReview]
    }))
  }

  if (error) return <p className="text-red">{error}</p>
  if (loading || !book) return <p>Loading...</p>

  return (
    <div className="container">
      <h1 className="title">{book.title}</h1>
      <p className="author">Author: {book.author}</p>
      <p className="genres">
        Genres: {book.genres?.map(g => g.name).join(', ') || 'No genres listed'}
      </p>
      <p className="description">{book.description || 'No description available'}</p>
      <p className="rating">Average Rating: {book.average_rating || 'N/A'}</p>

      <hr className="my-4" />
      <h2 className="reviews">Reviews</h2>
      <ReviewList reviews={book.reviews || []} />

      {user ? (
        <>
          <hr className="my-4" />
          <h3>Add a Review</h3>
          <ReviewForm bookId={book.id} onReviewSubmit={handleNewReview} />
          <AddToShelf bookId={book.id} />
        </>
      ) : (
        <p>Please login to add reviews or shelves</p>
      )}
    </div>
  )
}

export default BookDetail