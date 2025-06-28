import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ShelfForm({ onShelfCreated }) {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Shelf name is required')
      .min(2, 'Min 2 characters')
      .max(50, 'Max 50 characters'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      const res = await fetch('https://backend-h5uy.onrender.com/shelves', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create shelf');
      }

      const newShelf = await res.json();
      onShelfCreated(newShelf);
      resetForm();
      setStatus({ type: 'success', message: 'Shelf created!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className="shelf-form">
          <h3 className="shelf-form__title">Create New Shelf</h3>

          <div className="shelf-form__group">
            <label htmlFor="shelf-name" className="shelf-form__label">Shelf Name</label>
            <Field
              id="shelf-name"
              name="name"
              className="shelf-form__input"
              placeholder="e.g. Fantasy Favorites"
              disabled={isSubmitting}
            />
            <ErrorMessage name="name" component="div" className="shelf-form__error" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="shelf-form__submit"
          >
            {isSubmitting ? 'Creating...' : 'Create Shelf'}
          </button>

          {status && (
            <p className={`shelf-form__message shelf-form__message--${status.type}`}>
              {status.message}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default ShelfForm;
