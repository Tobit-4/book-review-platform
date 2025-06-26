import { React, useState,useEffect } from 'react'
import BookCard from '../components/BookCard'

function HomePage() {
    const [ books, setBooks] = useState([])
    useEffect(() => {
        fetch('http://127.0.0.1:5000/booklist')
        .then(r => r.json)
        .then(data => setBooks(data))
        .catch((e) => console.error('Failed to fetch books:', e))
    },[])

  return (
    <div>
      <h1 className='book-header'>Book List</h1>
      <div className='book-list'>
        {
            books.map((book) => (
                <BookCard key={book.id} book={book}/>
            ))
        }
      </div>
    </div>
  )
}

export default HomePage
