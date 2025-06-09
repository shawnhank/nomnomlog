import { useState } from 'react';
import { updateProfile, changePassword } from '../../services/authService';

export default function ProfilePage({ user, setUser }) {
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  async function handleProfileSubmit(evt) {
    evt.preventDefault();
    try {
      const updatedUser = await updateProfile(profileData);
      setUser(updatedUser);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg('Profile update failed - Try again');
    }
  }
  
  async function handlePasswordSubmit(evt) {
    evt.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordMsg('Password updated successfully!');
    } catch (err) {
      setPasswordMsg('Password update failed - Try again');
    }
  }
  
  function handleProfileChange(evt) {
    setProfileData({ ...profileData, [evt.target.name]: evt.target.value });
    setProfileMsg('');
  }
  
  function handlePasswordChange(evt) {
    setPasswordData({ ...passwordData, [evt.target.name]: evt.target.value });
    setPasswordMsg('');
  }
  
  return (
    <>
      <h2>My Profile</h2>
      
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
      
      {activeTab === 'profile' && (
        <form autoComplete="off" onSubmit={handleProfileSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            required
          />
          <button type="submit">UPDATE PROFILE</button>
          <p className="message">{profileMsg}</p>
        </form>
      )}
      
      {activeTab === 'password' && (
        <form autoComplete="off" onSubmit={handlePasswordSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
          <button 
            type="submit" 
            disabled={passwordData.newPassword !== passwordData.confirmPassword}
          >
            CHANGE PASSWORD
          </button>
          <p className="message">{passwordMsg}</p>
        </form>
      )}
    </>
  );
}