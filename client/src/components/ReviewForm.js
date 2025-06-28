import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ReviewForm({ bookId, onReviewSubmit }) {
  const validationSchema = Yup.object({
    rating: Yup.number()
      .required('Rating is required')
      .min(1, 'Minimum rating is 1')
      .max(5, 'Maximum rating is 5'),
    comment: Yup.string()
      .required('Comment is required')
      .min(2, 'Comment must be at least 2 characters'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('https://backend-h5uy.onrender.com/reviews', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: Number(bookId),
          rating: Number(values.rating),
          comment: values.comment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const newReview = await res.json();
      onReviewSubmit(newReview);
      resetForm();
      setStatus({ type: 'success', message: 'Review submitted!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ rating: '', comment: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-4 mt-2 book-form">
          <h3 className="book-form__title">Leave a Review</h3>

          {status && (
            <p className={`book-form__message book-form__message--${status.type}`}>
              {status.message}
            </p>
          )}

          <div className="book-form__field">
            <label className="book-form__label">Rating (1–5)</label>
            <Field
              type="number"
              name="rating"
              min="1"
              max="5"
              className="book-form__input"
            />
            <ErrorMessage name="rating" component="div" className="book-form__error" />
          </div>

          <div className="book-form__field">
            <label className="book-form__label">Comment</label>
            <Field
              as="textarea"
              name="comment"
              className="book-form__textarea"
              rows="4"
            />
            <ErrorMessage name="comment" component="div" className="book-form__error" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="book-form__submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default ReviewForm;
