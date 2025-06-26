// client/src/App.jsx
import React, { useState,useEffect } from 'react'
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
import AddBookForm from './components/AddBookForm'
import BookList from './components/BookList'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'

function App() {
    const [user, setUser] = useState()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }, [])

    const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("👋 Logged out");
  }
  

  return (
    <Router>
      <NavBar user={user} setUser={setUser} onLogout={handleLogout}/>
      <div className="nav_bar_container">
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
          <Route path="/booklist" element={<BookList />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </Router>
  )
}

export default App
