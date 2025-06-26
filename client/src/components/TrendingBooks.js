// client/src/components/TrendingBooks.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TrendingBooks() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/trending')
      .then((res) => res.json())
      .then(setBooks)
  }, [])

  return (
    <div className="trending-container">
      <h2 className="trending-container">🔥 Trending Books</h2>
      {books.length === 0 ? (
        <p>No trending books yet.</p>
      ) : (
        <div className="trending">
          {books.map((book) => (
            <Link
              to={`/bookdetails/${book.id}`}
              key={book.id}
              className="trending-book"
            >
              <h3 className="title">{book.title}</h3>
              <p className="author">{book.author}</p>
              <p className="rating">Rating: {book.average_rating || 'N/A'}</p>
              {book.genres && (
                <p className="genres">
                  {book.genres.map((g) => g.name).join(', ')}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrendingBooks
