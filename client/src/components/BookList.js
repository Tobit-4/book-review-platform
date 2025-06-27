import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/booklist', {
            credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

  if (loading) return <div className="loading-spinner">Loading books...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (books.length === 0) return <div className="no-books">No books found</div>;

  return (
    <div className="book-list-container">
      <header className="book-list-header">
        <h1 className="book-list-title">All Books</h1>
        <div className="book-count">{books.length} books available</div>
      </header>
      
      <div className="book-grid">
        {books.map((book) => (
          <article key={`book-${book.id}`} className="book-card">
            <Link to={`/book/${book.id}`} className="book-card-link">
              <div className="book-cover-container">
                <img
                  src={book.cover_image_url || '/default-book-cover.jpg'}
                  alt={`Cover of ${book.title}`}
                  className="book-cover"
                />
              </div>
              
              <div className="book-content">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">By {book.author}</p>
                
                <div className="book-meta">
                  <div className="book-rating">
                    {renderRatingStars(book.average_rating)}
                    <span className="rating-value">
                      {book.average_rating ? parseFloat(book.average_rating).toFixed(1) : 'N/R'}
                    </span>
                  </div>
                  
                  {book.genres?.length > 0 && (
                    <div className="book-genres">
                      {book.genres.slice(0, 2).map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                      {book.genres.length > 2 && (
                        <span className="more-genres">+{book.genres.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// Helper function for star ratings
function renderRatingStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="star half">½</span>);
    } else {
      stars.push(<span key={i} className="star">☆</span>);
    }
  }

  return <div className="stars-container">{stars}</div>;
}

export default BookList;