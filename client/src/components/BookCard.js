import React from 'react'
import { Link } from 'react-router-dom';


function BookCard({ book }) {
  return (
    <div className='book-card'>
      <h2 className='title'>{book.title}</h2>
      <p className='author'>Author: {book.author}</p>
      <p>
        Genres: {book.genres.map((g) => g.name).join(', ')}
      </p>
      <p className='rating'>Rating: {book.average_rating}</p>
      <Link
        to={`/book/${book.id}`}
        className="book-card"
      >
        View Details
      </Link>
    </div>
  )
}

export default BookCard;
