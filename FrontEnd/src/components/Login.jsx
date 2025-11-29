import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = ({ onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const identifier = form.identifier.value.trim();
    const password = form.password.value;

    // Client-side validation
    if (!identifier || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        setErrorMessage('');
        
        // Call parent component callback to update navbar
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(result.user);
        }
        
        if (typeof onClose === 'function') onClose();
        navigate('/'); 
      } else {
        setErrorMessage(result.error || 'Login failed');
        form.password.value = '';
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="login-form-container">
      <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Login</h2>
      {errorMessage && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          fontSize: '0.9rem'
        }}>
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="identifier" style={{ display: 'block', marginBottom: '0.5rem', color: '#1f2937' }}>Email or Username</label>
          <input 
            type="text" 
            id="identifier" 
            name="identifier" 
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#1f2937' }}>Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required
            minLength="6"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
