import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './ProfilePage.css';

export default function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    userImages: user.userImages || []
  });
  
  const [formData, setFormData] = useState({...originalData});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes whenever formData updates
  useEffect(() => {
    const changed = 
      formData.fullName !== originalData.fullName || 
      formData.email !== originalData.email ||
      JSON.stringify(formData.userImages) !== JSON.stringify(originalData.userImages);
    
    setHasChanges(changed);
  }, [formData, originalData]);

  function handleChange(evt) {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value
    });
    setMessage('');
  }

  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
    setMessage('');
  }

  function handleCancel() {
    // Reset form to original values
    setFormData({...originalData});
    setMessage('');
    navigate('/');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    
    if (!hasChanges) {
      setMessage('No changes to save.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Send the complete form data including images
      const updatedUser = await authService.updateProfile(formData);
      
      // Update the user in the parent component state
      setUser(updatedUser);
      
      // Update the original data to match the current state
      setOriginalData({...formData});
      setMessage('Profile updated successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ProfilePage">
      <h1>My Profile</h1>
      
      {message && <p className={message.includes('Failed') ? 'text-red-500' : message.includes('No changes') ? 'text-yellow-500' : 'text-green-500'}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Add MultiImageUploader */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photos</label>
          <MultiImageUploader 
            images={formData.userImages} 
            onImagesUpdated={handleImagesUpdated}
            entityType="user"
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            type="button" 
            onClick={handleCancel}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              hasChanges 
                ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' 
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            disabled={loading || !hasChanges}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
