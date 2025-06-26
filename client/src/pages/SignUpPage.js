import { React,useState,useEffect } from 'react'
import { AuthContext } from './Authenticate'

function SignUpPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
        if (res.ok) {
          login(data.user, data.access_token);
        } else {
          alert(data.error || 'Signup failed');
        }
      };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input name="username" placeholder="Username" onChange={e => setFormData({ ...formData, username: e.target.value })} />
      <input type="password" name="password" placeholder="Password" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default SignUpPage
