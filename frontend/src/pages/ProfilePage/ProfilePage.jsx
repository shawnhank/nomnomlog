import { useState, useEffect } from 'react';
import * as userService from '../../services/userService';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './ProfilePage.css';

export default function ProfilePage({ user, setUser }) {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    userImages: user.userImages || []
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(evt) {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value
    });
  }

  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ProfilePage">
      <h1>My Profile</h1>
      
      {message && <p className={message.includes('Failed') ? 'text-red-500' : 'text-green-500'}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        {/* ... */}
        
        {/* Add MultiImageUploader */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photos</label>
          <MultiImageUploader 
            images={formData.userImages} 
            onImagesUpdated={handleImagesUpdated}
            entityType="user"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
