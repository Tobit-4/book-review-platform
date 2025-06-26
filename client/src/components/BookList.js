import { React,useState,useEffect } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

function BookList() {
    const [ books, setBooks ] = useState([])
    useEffect(()=>{
        fetch('http://127.0.0.1:5000/booklist',{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(r => r.json)
        .then(data=>setBooks(data))
        .catch((e) => ('Failed to fetch books:',e))
    },{})
  return (
    <div className='booklist'>
      <h1>All books</h1>
      <div>
        {
            books.map((book)=>(
                <div key={book.id}>
                    {
                        book.cover_image_url && (
                            <img
                                src={book.cover_image_url}
                                alt={book.title}
                                />
                        )
                    }
                    <h2>{book.title}</h2>
                    <p>By: {book.author}</p>
                    <p>Rating: {book.average_rating}</p>
                    <p>
                        {
                            book.genres.map((g) => g.name).join(', ')
                        }
                    </p>
                    <Link
                        to={`/book/${book.id}`}
                    >
                        View Details
                    </Link>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default BookList
