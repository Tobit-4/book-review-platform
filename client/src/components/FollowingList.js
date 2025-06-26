// client/src/components/FollowingList.jsx
import { useState, useEffect } from 'react'

function FollowingList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/follows/mine', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  return (
    <div className="container">
      <h2 className="following">Users You're Following</h2>
      {users.length === 0 ? (
        <p>You are not following anyone yet.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FollowingList
