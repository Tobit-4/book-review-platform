// client/src/components/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setUser(data.user);
        navigate("/booklist");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="username" onChange={handleChange} value={formData.username} placeholder="Username" />
      <input name="password" onChange={handleChange} value={formData.password} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
