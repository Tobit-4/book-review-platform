// client/src/components/ShelvesList.jsx
import { useEffect, useState } from 'react'
import ShelfForm from './ShelfForm'

function ShelvesList({ user }) {
  const [shelves, setShelves] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/myshelves', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!res.ok) throw new Error('Failed to load shelves')
        const data = await res.json()
        setShelves(data)
      } catch (err) {
        setError(err.message)
      }
    }

    if (user) fetchShelves()
  }, [user])

  const handleDeleteShelf = async (shelfId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/shelves/${shelfId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!res.ok) throw new Error('Failed to delete shelf')
      setShelves((prev) => prev.filter((s) => s.id !== shelfId))
    } catch (err) {
      alert(err.message)
    }
  }

  if (!user) return <p>Please login to view your shelves.</p>
  if (error) return <p className="text-red">{error}</p>

  return (
    <div className="shelf-container">
      <h2 className="shelves">Your Shelves</h2>
      <ShelfForm onShelfCreated={handleNewShelf} />
      {shelves.length === 0 ? (
        <p>No shelves yet.</p>
      ) : (
        shelves.map((shelf) => (
          <div key={shelf.id} className="my-shelves">
            <h3 className="font-semibold">{shelf.name}</h3>
            {shelf.books?.length > 0 ? (
              <ul className="num-shelves">
                {shelf.books.map((book) => (
                  <li key={book.id}>{book.title} by {book.author}</li>
                ))}
              </ul>
            ) : (
              <p className="null">No books on this shelf.</p>
            )}
          </div>
        ))
      )}
      <button onClick={() => handleDeleteShelf(shelf.id)}>
        Delete
      </button>
    </div>
  )
}

export default ShelvesList
