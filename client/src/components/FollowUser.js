// client/src/components/FollowUser.jsx
import { useState, useEffect } from 'react'

function FollowUser({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/follows/check/${targetUserId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setIsFollowing(data.following))
  }, [targetUserId])

  const toggleFollow = async () => {
    const method = isFollowing ? 'DELETE' : 'POST'
    const url = `http://127.0.0.1:5000/follows/${targetUserId}`

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (res.ok) {
      setIsFollowing(!isFollowing)
    } else {
      alert('Failed to update follow status')
    }
  }

  return (
    <button
      onClick={toggleFollow}
      className={`px-3 py-1 rounded text-white ${
        isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}

export default FollowUser
