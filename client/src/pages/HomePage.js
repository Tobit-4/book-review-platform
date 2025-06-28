import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

function HomePage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://backend-h5uy.onrender.com/booklist')
            .then(r => {
                if (!r.ok) {
                    throw new Error('Network response was not ok');
                }
                return r.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setBooks(data);
                } else {
                    throw new Error('Expected array but got ' + typeof data);
                }
            })
            .catch((e) => {
                console.error('Failed to fetch books:', e);
                setError(e.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading books...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div>
            <div className='book-header'>
                <h1>Welcome Shuo</h1>
                <h1>Book List</h1>
            </div>
            <div className='book-list'>
                {books.length > 0 ? (
                    books.map((book) => (
                        <BookCard key={book.id} book={book}/>
                    ))
                ) : (
                    <p>No books available</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;