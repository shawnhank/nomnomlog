import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signUp } from '../../services/authService';
import './SignUpPage.css';

export default function SignUpPage({ setUser }) {
  // State to track form input values
  const [formData, setFormData] = useState({
    fname: '',        
    lname: '',        
    name: '',         
    email: '',        
    password: '',     
    confirm: '',      
  });
  
  // State to track error messages
  const [errorMsg, setErrorMsg] = useState('');
   
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Handler for form input changes
  function handleChange(evt) {
    // Update the corresponding form field and clear any error messages
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  // Handler for form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Create a copy of the form data for submission
      const dataToSubmit = { ...formData };
      
      // If name is empty but fname or lname are provided, 
      // automatically create a display name from first and last name
      if (!dataToSubmit.name && (dataToSubmit.fname || dataToSubmit.lname)) {
        dataToSubmit.name = [dataToSubmit.fname, dataToSubmit.lname]
          .filter(Boolean)  // Remove empty strings
          .join(' ');       // Join with space
      }
      
      // Call the API to sign up the user
      const user = await signUp(dataToSubmit);
      
      // Update the user state in the parent component
      setUser(user);
      
      // Redirect to the posts page after successful signup
      navigate('/posts');
    } catch (err) {
      // Display error message if signup fails
      setErrorMsg('Sign Up Failed - Try Again');
    }
  }

  // Disable the submit button if passwords don't match
  const disable = formData.password !== formData.confirm;

  return (
    <div className="SignUpPage">
      <h2>Sign Up</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="optional-note">Optional - leave blank to use First/Last name</div>
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn" disabled={disable}>
          SIGN UP
        </button>
      </form>
      
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      
      <div className="login-link">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}
