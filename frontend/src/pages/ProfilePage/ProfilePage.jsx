import { useState } from 'react';
import { updateProfile, changePassword } from '../../services/authService';

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
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset password form fields after successful update
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Show success message
      setPasswordMsg('Password updated successfully!');
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
    <>
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
          {/* First Name field - new field from our updated User model */}
          <label>First Name</label>
          <input
            type="text"
            name="fname"
            value={profileData.fname}
            onChange={handleProfileChange}
          />
          
          {/* Last Name field - new field from our updated User model */}
          <label>Last Name</label>
          <input
            type="text"
            name="lname"
            value={profileData.lname}
            onChange={handleProfileChange}
          />
          
          {/* Display Name field - can be auto-generated from first and last name */}
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            placeholder="Leave blank to use First/Last name"
            required
          />
          
          {/* Email field */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            required
          />
          
          {/* Submit button for profile updates */}
          <button type="submit">UPDATE PROFILE</button>
          
          {/* Message area for profile update feedback */}
          <p className="message">{profileMsg}</p>
        </form>
      )}
      
      {/* Password Change Form - shown when password tab is active */}
      {activeTab === 'password' && (
        <form autoComplete="off" onSubmit={handlePasswordSubmit}>
          {/* Current Password field - for verification */}
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          
          {/* New Password field */}
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
          
          {/* Confirm New Password field - must match new password */}
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
          
          {/* Submit button - disabled if passwords don't match */}
          <button 
            type="submit" 
            disabled={passwordData.newPassword !== passwordData.confirmPassword}
          >
            CHANGE PASSWORD
          </button>
          
          {/* Message area for password change feedback */}
          <p className="message">{passwordMsg}</p>
        </form>
      )}
    </>
  );
}