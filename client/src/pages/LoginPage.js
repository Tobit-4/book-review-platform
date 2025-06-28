import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("https://backend-h5uy.onrender.com/login", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success('🎉 Login successful! Redirecting...');

        const userData = data.user;

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setTimeout(() => navigate("/booklist"), 1500);
      } else {
        toast.error(data.error || "❌ Invalid email or password");
      }
    } catch (err) {
      toast.error("⚠️ Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="your@email.com"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="••••••••"
            className="form-input"
            minLength="6"
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="auth-link">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;