import { useState } from 'react';
import { updateProfile, changePassword } from '../../services/authService';
import './ProfilePage.css';

export default function ProfilePage({ user, setUser }) {
  // State for profile data - includes fname and lname fields from our updated User model
  const [profileData, setProfileData] = useState({
    fname: user.fname || '',    
    lname: user.lname || '',  
    name: user.name,          
    email: user.email,        
  });
  
  // State for password change functionality
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',      
    newPassword: '',          
    confirmPassword: '',      
  });
  
  // State for user feedback messages
  const [profileMsg, setProfileMsg] = useState('');  // Message for profile updates
  const [passwordMsg, setPasswordMsg] = useState(''); // Message for password changes
  
  // State to track which tab is active (profile or password)
  const [activeTab, setActiveTab] = useState('profile');
  
  /**
   * Handle profile form submission
   * Updates user profile information including first name, last name, display name, and email
   */
  async function handleProfileSubmit(evt) {
    evt.preventDefault();
    try {
      // Create a copy of the profile data for submission
      const dataToSubmit = { ...profileData };
      
      // If display name is empty but first or last name are provided,
      // automatically generate a display name from first and last name
      if (!dataToSubmit.name && (dataToSubmit.fname || dataToSubmit.lname)) {
        dataToSubmit.name = [dataToSubmit.fname, dataToSubmit.lname]
          .filter(Boolean)  // Remove empty strings
          .join(' ');       // Join with space
      }
      
      // Call API to update the user's profile
      const updatedUser = await updateProfile(dataToSubmit);
      
      // Update the user state in the parent component
      setUser(updatedUser);
      
      // Show success message
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      // Show error message if update fails
      setProfileMsg('Profile update failed - Try again');
    }
  }
  
  /**
   * Handle password change form submission
   * Verifies current password and updates to new password if confirmed
   */
  async function handlePasswordSubmit(evt) {
    evt.preventDefault();
    
    // Validate that new password and confirmation match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    
    try {
      // Call API to change the password
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset password form fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // If server indicates re-login is required
      if (response.requireRelogin) {
        // Clear the stored token
        localStorage.removeItem('token');
        // Update user state to null
        setUser(null);
        // Redirect to login page
        navigate('/login', { 
          state: { message: 'Password updated successfully. Please log in with your new password.' }
        });
      } else {
        // Show success message
        setPasswordMsg('Password updated successfully!');
      }
    } catch (err) {
      // Show error message if password change fails
      setPasswordMsg('Password update failed - Try again');
    }
  }
  
  /**
   * Handle changes to profile form input fields
   * Updates the corresponding field in state and clears any messages
   */
  function handleProfileChange(evt) {
    setProfileData({ 
      ...profileData, 
      [evt.target.name]: evt.target.value 
    });
    setProfileMsg(''); // Clear any previous messages
  }
  
  /**
   * Handle changes to password form input fields
   * Updates the corresponding field in state and clears any messages
   */
  function handlePasswordChange(evt) {
    setPasswordData({ 
      ...passwordData, 
      [evt.target.name]: evt.target.value 
    });
    setPasswordMsg(''); // Clear any previous messages
  }
  
  return (
    <div className="ProfilePage">
      <h2>My Profile</h2>
      
      {/* Tab navigation */}
      <div className="tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          Edit Profile
        </button>
        <button 
          className={activeTab === 'password' ? 'active' : ''} 
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>
      
      {/* Profile Edit Form - shown when profile tab is active */}
      {activeTab === 'profile' && (
        <form autoComplete="off" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="fname"
              value={profileData.fname}
              onChange={handleProfileChange}
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lname"
              value={profileData.lname}
              onChange={handleProfileChange}
            />
          </div>
          
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="Leave blank to use First/Last name"
              required
            />
            <div className="optional-note">Leave blank to use First/Last name</div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </div>
          
          <button type="submit">UPDATE PROFILE</button>
          
          <p className={`message ${profileMsg.includes('failed') ? 'error-message' : ''}`}>
            {profileMsg}
          </p>
        </form>
      )}
      
      {/* Password Change Form - shown when password tab is active */}
      {activeTab === 'password' && (
        <form autoComplete="off" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={passwordData.newPassword !== passwordData.confirmPassword}
          >
            CHANGE PASSWORD
          </button>
          
          <p className={`message ${passwordMsg.includes('failed') ? 'error-message' : ''}`}>
            {passwordMsg}
          </p>
        </form>
      )}
    </div>
  );
}
