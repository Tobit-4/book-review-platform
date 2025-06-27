import { useState } from 'react';

function ShelfForm({ onShelfCreated }) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
        console.log('Submitting shelf:', { name }); // Debug log
      const res = await fetch('http://127.0.0.1:5000/shelves', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create shelf');
      }

      const newShelf = await res.json();
      console.log('API Response:', newShelf);
      setName('');
      onShelfCreated(newShelf);
    } catch (err) {
        console.error('Error creating shelf:', err)
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shelf-form">
      <h3 className="shelf-form__title">Create New Shelf</h3>

      <div className="shelf-form__group">
        <label htmlFor="shelf-name" className="shelf-form__label">
          Shelf Name
        </label>
        <input
          id="shelf-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shelf-form__input"
          required
          minLength="2"
          maxLength="50"
          placeholder="e.g. Fantasy Favorites"
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="shelf-form__error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="shelf-form__submit"
        aria-label={submitting ? 'Creating shelf' : 'Create new shelf'}
      >
        {submitting ? (
          <>
            <span className="shelf-form__spinner"></span>
            Creating...
          </>
        ) : (
          'Create Shelf'
        )}
      </button>
    </form>
  );
}

export default ShelfForm;