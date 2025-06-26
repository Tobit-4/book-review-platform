import { useEffect, useState } from 'react';
import ShelfForm from './ShelfForm';

function ShelvesList({ user }) {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:5000/myshelves', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Failed to load shelves');
        const data = await res.json();
        setShelves(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchShelves();
  }, [user]);

  const handleNewShelf = (newShelf) => {
    setShelves(prevShelves => [newShelf, ...prevShelves]);
  };

  const handleDeleteShelf = async (shelfId) => {
    if (!window.confirm('Are you sure you want to delete this shelf?')) return;
    
    try {
      setDeletingId(shelfId);
      const res = await fetch(`http://127.0.0.1:5000/shelves/${shelfId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete shelf');
      setShelves((prev) => prev.filter((s) => s.id !== shelfId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return <p className="shelf-login-prompt">Please login to view your shelves.</p>;
  if (loading) return <div className="shelf-loading">Loading shelves...</div>;
  if (error) return <p className="shelf-error">{error}</p>;

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
          {shelves.map((shelf) => (
            <article key={shelf.id} className="shelf-card">
              <header className="shelf-card-header">
                <h3 className="shelf-card-title">{shelf.name}</h3>
                <span className="shelf-book-count">
                  {shelf.books?.length || 0} book{shelf.books?.length !== 1 ? 's' : ''}
                </span>
              </header>

              {shelf.books?.length > 0 ? (
                <ul className="shelf-book-list">
                  {shelf.books.slice(0, 3).map((book) => (
                    <li key={book.id} className="shelf-book-item">
                      <span className="shelf-book-title">{book.title}</span>
                      <span className="shelf-book-author">by {book.author}</span>
                    </li>
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
          ))}
        </div>
      )}
    </div>
  );
}

export default ShelvesList;