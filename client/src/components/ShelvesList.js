import { useEffect, useState } from 'react';
import ShelfForm from './ShelfForm';

function ShelvesList({ user }) {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchShelves = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch('https://backend-h5uy.onrender.com/shelves?include_books=true', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch shelves');
      }

      const data = await response.json();
      // Filter out any null or invalid shelf objects
      const validShelves = (data.shelves || data || []).filter(shelf => 
        shelf && typeof shelf === 'object' && shelf.id && shelf.name
      );
      setShelves(validShelves);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setShelves([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchShelves();
  }, [user]);

  const handleNewShelf = (newShelf) => {
    if (newShelf && newShelf.id && newShelf.name) {
      setShelves(prev => [newShelf, ...prev]);
    }
  };

  const handleDeleteShelf = async (shelfId) => {
    if (!window.confirm('Are you sure you want to delete this shelf?')) return;
    
    try {
      setDeletingId(shelfId);
      const res = await fetch(`https://backend-h5uy.onrender.com/shelves/${shelfId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete shelf');
      setShelves(prev => prev.filter(shelf => shelf?.id !== shelfId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return <p className="shelf-login-prompt">Please login to view your shelves.</p>;
  if (loading) return <div className="shelf-loading">Loading shelves...</div>;
  if (error) return <p className="shelf-error">Error: {error}</p>;

  return (
    <div className="shelf-list-container">
      <header className="shelf-list-header">
        <h2 className="shelf-list-title">Your Shelves</h2>
        <ShelfForm onShelfCreated={handleNewShelf} />
      </header>

      {shelves.length === 0 ? (
        <div className="shelf-empty-state">
          <p>You don't have any shelves yet. Create your first shelf above!</p>
        </div>
      ) : (
        <div className="shelf-grid">
          {shelves.map(shelf => (
            shelf && ( // Add null check here
              <article key={shelf.id} className="shelf-card">
                <header className="shelf-card-header">
                  <h3 className="shelf-card-title">{shelf.name}</h3>
                  <span className="shelf-book-count">
                    {shelf.book_count || 0} book{shelf.book_count !== 1 ? 's' : ''}
                  </span>
                </header>

                {shelf.books?.length > 0 ? (
                  <ul className="shelf-book-list">
                    {shelf.books.slice(0, 3).map(book => (
                      book && ( // Add null check for books too
                        <li key={book.id} className="shelf-book-item">
                          <span className="shelf-book-title">{book.title}</span>
                          <span className="shelf-book-author">by {book.author}</span>
                        </li>
                      )
                    ))}
                    {shelf.books.length > 3 && (
                      <li className="shelf-more-books">
                        +{shelf.books.length - 3} more
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="shelf-no-books">No books on this shelf</p>
                )}

                <footer className="shelf-card-footer">
                  <button
                    onClick={() => handleDeleteShelf(shelf.id)}
                    className="shelf-delete-btn"
                    disabled={deletingId === shelf.id}
                    aria-label={`Delete ${shelf.name} shelf`}
                  >
                    {deletingId === shelf.id ? 'Deleting...' : 'Delete Shelf'}
                  </button>
                </footer>
              </article>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default ShelvesList;