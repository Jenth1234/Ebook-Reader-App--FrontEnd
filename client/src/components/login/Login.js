import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8080/loginadmin', { email, password });
        const token = response.data.token; // Retrieve token from response
        localStorage.setItem('token', token); // Store token in localStorage
        console.log(response.data); // Handle token or other returned data here
        navigate('/admin'); // Redirect to another page
      } catch (error) {
        setError(error.response.data.error);
      }
    };
  
    return (
      <div className="login-container"> {/* Add a class for styling */}
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form"> {/* Add a class for styling */}
          <div className="form-group"> {/* Add a class for styling */}
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group"> {/* Add a class for styling */}
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-button">Login</button> {/* Add a class for styling */}
        </form>
        {error && <div className="error-message">{error}</div>} {/* Add a class for styling */}
      </div>
    );
  }
  
  export default Login;
