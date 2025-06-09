import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';

export default function SignUpPage({ setUser }) {
  // State to track form input values
  // Added fname and lname fields to match updated User model
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
    <>
      <h2>Sign Up!</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        {/* First Name field (new) */}
        <label>First Name</label>
        <input
          type="text"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
        />
        
        {/* Last Name field (new) */}
        <label>Last Name</label>
        <input
          type="text"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
        />
        
        {/* Display Name field (optional) */}
        <label>Display Name (optional)</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Leave blank to use First/Last name"
        />
        
        {/* Email field (required) */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        {/* Password field (required) */}
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        {/* Password confirmation field (required) */}
        <label>Confirm</label>
        <input
          type="password"
          name="confirm"
          value={formData.confirm}
          onChange={handleChange}
          required
        />
        
        {/* Submit button - disabled if passwords don't match */}
        <button type="submit" disabled={disable}>
          SIGN UP
        </button>
      </form>
      
      {/* Error message display */}
      <p className="error-message">&nbsp;{errorMsg}</p>
    </>
  );
}