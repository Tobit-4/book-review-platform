import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function AddBookForm({ token, onBookAdded }) {
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, 'Min 3 characters'),
    author: Yup.string().required('Author is required'),
    description: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      const res = await fetch('https://backend-h5uy.onrender.com/booklist', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to add book');

      const newBook = await res.json();
      onBookAdded?.(newBook);
      resetForm();
      setStatus({ type: 'success', message: 'Book added successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ title: '', author: '', description: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className="book-form">
          <h2 className="book-form__title">Add a New Book</h2>

          <div className="book-form__field">
            <label className="book-form__label">Title:</label>
            <Field name="title" className="book-form__input" />
            <ErrorMessage name="title" component="div" className="book-form__error" />
          </div>

          <div className="book-form__field">
            <label className="book-form__label">Author:</label>
            <Field name="author" className="book-form__input" />
            <ErrorMessage name="author" component="div" className="book-form__error" />
          </div>

          <div className="book-form__field">
            <label className="book-form__label">Description:</label>
            <Field name="description" as="textarea" className="book-form__textarea" rows="3" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`book-form__submit ${isSubmitting ? 'book-form__submit--loading' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Add Book'}
          </button>

          {status && (
            <p className={`book-form__message book-form__message--${status.type}`}>
              {status.message}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default AddBookForm;
