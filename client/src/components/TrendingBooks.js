import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TrendingBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/books/trending',{
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch trending books');
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching trending books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  if (loading) {
    return (
      <div className="trending-loading">
        <div className="spinner"></div>
        <p>Loading trending books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-error">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="trending-section">
      <header className="trending-header">
        <h2 className="trending-title">
          <span role="img" aria-label="fire">🔥</span> Trending Books
        </h2>
        <p className="trending-subtitle">Most popular books this week</p>
      </header>

      {books.length === 0 ? (
        <div className="trending-empty">
          <p>No trending books at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="trending-grid">
          {books.map((book) => (
            <article key={book.id} className="trending-book-card">
              <Link to={`/book/${book.id}`} className="book-link">
                {book.cover_image_url && (
                  <div className="book-cover-container">
                    <img
                      src={book.cover_image_url}
                      alt={`Cover of ${book.title}`}
                      className="book-cover"
                    />
                  </div>
                )}
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-rating">
                    {renderRatingStars(book.average_rating)}
                    <span className="rating-value">
                      {book.average_rating ? parseFloat(book.average_rating).toFixed(1) : 'N/A'}
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
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// Helper function to render rating stars
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

export default TrendingBooks;