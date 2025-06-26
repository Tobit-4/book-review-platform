// client/src/components/ShelfForm.jsx
import { useState } from 'react'

function ShelfForm({ onShelfCreated }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('http://127.0.0.1:5000/shelves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error('Failed to create shelf')

      const newShelf = await res.json()
      setName('')
      onShelfCreated(newShelf)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3 className="new-shelf">Create a New Shelf</h3>

      <label className="shelf-name">Shelf Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input-shelf"
      />

      {error && <p className="text-red">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="submit-shelf"
      >
        {submitting ? 'Creating...' : 'Create Shelf'}
      </button>
    </form>
  )
}

export default ShelfForm
