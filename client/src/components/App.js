// client/src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import BookDetail from './components/BookDetail'
import MyReviews from './components/MyReviews'
import FollowUser from './components/FollowUser'
import ShelvesList from './components/ShelvesList'
import TrendingBooks from './components/TrendingBooks'
import AddBookForm from './AddBookForm'

function App() {
  const [user, setUser] = useState(null)
  const token = localStorage.getItem('token')

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
          <Route path="/book/:id" element={<BookDetail user={user} />} />
          <Route path="/myreviews" element={<MyReviews token={token} />} />
          <Route path="/follows" element={<FollowUser user={user} />} />
          <Route path="/shelves" element={<ShelvesList />} />
          <Route path="/trending" element={<TrendingBooks />} />
          <Route path="/addbook" element={<AddBookForm token={token} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
