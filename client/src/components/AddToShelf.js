import { useState, useEffect } from 'react';

function AddToShelf({ bookId }) {
  const [shelves, setShelves] = useState([]);
  const [selectedShelfId, setSelectedShelfId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/shelves/mine', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch shelves');
        const data = await res.json();
        setShelves(data);
      } catch (err) {
        setMessage({ text: err.message, type: 'error' });
      }
    };
    fetchShelves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShelfId) {
      setMessage({ text: 'Please select a shelf', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/shelves/${selectedShelfId}/books`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ book_id: bookId }),
        }
      );

      if (!res.ok) throw new Error('Failed to add book to shelf');
      setMessage({ text: 'Book added to shelf successfully!', type: 'success' });
      setSelectedShelfId('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
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
          {shelves.map((shelf) => (
            <option key={shelf.id} value={shelf.id}>
              {shelf.name}
            </option>
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