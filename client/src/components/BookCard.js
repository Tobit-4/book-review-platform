import React from 'react'
import { Link } from 'react-router-dom';


function BookCard({ book }) {
    const genres = book.genres || 
        (book.genre_associations?.map(ga => ga.genre) || []);
  return (
    <div className='book-card'>
        <div className="book-cover-container">
            <img
            src={book.cover_image_url || '/default-book-cover.jpg'}
            alt={`Cover of ${book.title}`}
            className="book-cover"
            />
      </div>
      <h2 className='title'>{book.title}</h2>
      <p className='author'>Author: {book.author}</p>
      <p>Genres: {
        genres.length > 0 
          ? genres.map(g => g?.name).filter(Boolean).join(', ') 
          : 'No genres listed'
      }</p>
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
