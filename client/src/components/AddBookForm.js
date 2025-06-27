import { useState } from 'react';

function AddBookForm({ token, onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('http://127.0.0.1:5000/booklist', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add book');

      const newBook = await res.json();
      onBookAdded?.(newBook);
      setFormData({ title: '', author: '', description: '' });
      setMessage({ text: 'Book added successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2 className="book-form__title">Add a New Book</h2>

      <div className="book-form__field">
        <label className="book-form__label">Title:</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="book-form__input"
          required
        />
      </div>

      <div className="book-form__field">
        <label className="book-form__label">Author:</label>
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="book-form__input"
          required
        />
      </div>

      <div className="book-form__field">
        <label className="book-form__label">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="book-form__textarea"
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`book-form__submit ${submitting ? 'book-form__submit--loading' : ''}`}
      >
        {submitting ? (
          <>
            <span className="book-form__spinner"></span>
            Submitting...
          </>
        ) : (
          'Add Book'
        )}
      </button>

      {message && (
        <p className={`book-form__message book-form__message--${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default AddBookForm;