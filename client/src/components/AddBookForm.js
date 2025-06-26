import { useState } from 'react'

function AddBookForm({ token, onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('http://127.0.0.1:5000/booklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to add book')

      const newBook = await res.json()
      onBookAdded?.(newBook) // optional callback
      setFormData({ title: '', author: '', description: '' })
      setMessage('Book added successfully!')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow max-w-md space-y-3">
      <h2 className="text-lg font-semibold">Add a New Book</h2>

      <div>
        <label className="block">Title:</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-1 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block">Author:</label>
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="border p-1 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-1 rounded w-full"
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        {submitting ? 'Submitting...' : 'Add Book'}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  )
}

export default AddBookForm
