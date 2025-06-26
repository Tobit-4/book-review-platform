import { useState, useEffect } from 'react'

function AddToShelf({ bookId }) {
  const [shelves, setShelves] = useState([])
  const [selectedShelfId, setSelectedShelfId] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/shelves/mine', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setShelves)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://127.0.0.1:5000/shelves/${selectedShelfId}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      })

      if (!res.ok) throw new Error('Failed to add book to shelf')
      setMessage('Book added to shelf successfully!')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="submit-form">
      <label className="add-to-shelf">Add to Shelf:</label>
      <select
        value={selectedShelfId}
        onChange={(e) => setSelectedShelfId(e.target.value)}
        className="selected-shelf"
      >
        <option value="">Select shelf</option>
        {shelves.map((shelf) => (
          <option key={shelf.id} value={shelf.id}>
            {shelf.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="submit-to-shelf"
      >
        Add
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  )
}

export default AddToShelf
