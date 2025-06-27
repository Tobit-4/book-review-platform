import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookCard from './BookCard';

function SearchBook() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const navigate = useNavigate();

  // Fetch results when search params change
  useEffect(() => {
    const searchQuery = searchParams.get('query');
    if (searchQuery) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/books/search?query=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Search error:", err);
          setLoading(false);
        });
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading ? (
        <div className="loading-spinner">Loading results...</div>
      ) : results.length > 0 ? (
        <div className="search-results">
          <h3>Found {results.length} {results.length === 1 ? 'result' : 'results'}</h3>
          <div className="book-grid">
            {results.map(book => (
              <BookCard 
                key={book.id}
                book={book}
                showDetails={true}
              />
            ))}
          </div>
        </div>
      ) : searchParams.get('query') ? (
        <p className="no-results">No books found matching "{searchParams.get('query')}"</p>
      ) : (
        <p className="search-prompt">Enter a search term to find books</p>
      )}
    </div>
  );
}

export default SearchBook;