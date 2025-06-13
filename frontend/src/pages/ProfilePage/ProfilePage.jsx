import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Fieldset, Legend } from '../../components/catalyst/fieldset';
import { Heading } from '../../components/catalyst/heading';

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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Heading>My Profile</Heading>

      {message && (
        <div className={`mb-6 rounded-md p-4 ${
          message.includes('Failed')
            ? 'bg-red-50 dark:bg-red-900'
            : message.includes('No changes')
            ? 'bg-yellow-50 dark:bg-yellow-900'
            : 'bg-green-50 dark:bg-green-900'
        }`}>
          <p className={`text-sm ${
            message.includes('Failed')
              ? 'text-red-700 dark:text-red-200'
              : message.includes('No changes')
              ? 'text-yellow-700 dark:text-yellow-200'
              : 'text-green-700 dark:text-green-200'
          }`}>
            {message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Fieldset>
          <Legend>Personal Information</Legend>
          <div className="space-y-4">
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />

            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Profile Photos</Legend>
          <MultiImageUploader
            images={formData.userImages}
            onImagesUpdated={handleImagesUpdated}
            entityType="user"
          />
        </Fieldset>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            color="zinc"
            outline
            onClick={handleCancel}
            className="sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            color={hasChanges ? "blue" : "zinc"}
            disabled={loading || !hasChanges}
            className="flex-1 sm:flex-none"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
