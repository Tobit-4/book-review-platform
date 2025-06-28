import { useState, useEffect } from 'react';

function AddToShelf({ bookId }) {
  const [shelves, setShelves] = useState([]);
  const [selectedShelfId, setSelectedShelfId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const res = await fetch('https://backend-h5uy.onrender.com/shelves', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch shelves');
        }
        
        const { shelves: shelfData } = await res.json();
        // Ensure we have valid shelves data
        setShelves(Array.isArray(shelfData) ? shelfData : []);
      } catch (err) {
        setMessage({ text: err.message, type: 'error' });
        setShelves([]); // Reset to empty array on error
      }
    };
    fetchShelves();
  }, []);

  useEffect(() => {
    console.log("Book ID received by AddToShelf:", bookId);
  }, [bookId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShelfId || isSubmitting) return;
    if (!selectedShelfId) {
      setMessage({ text: 'Please select a shelf', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(
        `https://backend-h5uy.onrender.com/shelves/${selectedShelfId}/books`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ book_id: bookId }),
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add book to shelf');
      }

      // Safely update state with null checks
      if (result.shelf?.id) {
        setShelves(prevShelves => 
          (prevShelves || []).map(shelf => 
            shelf?.id === result.shelf.id 
              ? { ...shelf, books: result.shelf.books || [] } 
              : shelf
          )
        );
      }

      setMessage({ text: result.message, type: 'success' });
      setSelectedShelfId('');
      
    } catch (err) {
      setMessage({ 
        text: err.message || 'Failed to add book to shelf', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shelf-form">
      <div className="shelf-form__group">
        <label htmlFor="shelf-select" className="shelf-form__label">
          Add to Shelf:
        </label>
        <select
          id="shelf-select"
          value={selectedShelfId}
          onChange={(e) => setSelectedShelfId(e.target.value)}
          className="shelf-form__select"
          disabled={isSubmitting}
        >
          <option value="">Select shelf</option>
          {(shelves || []).map((shelf) => (
            shelf && (
              <option key={shelf.id} value={shelf.id}>
                {shelf.name}
              </option>
            )
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="shelf-form__submit"
        disabled={!selectedShelfId || isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>

      {message.text && (
        <p className={`shelf-form__message shelf-form__message--${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default AddToShelf;