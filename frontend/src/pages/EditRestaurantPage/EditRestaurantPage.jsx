import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import { Alert } from '../../components/catalyst/alert';
import { Heading } from '../../components/catalyst/heading';
import { Button } from '../../components/catalyst/button';
import RestaurantForm from '../../components/RestaurantForm/RestaurantForm';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';

export default function EditRestaurantPage() {
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch restaurant data when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const restaurantData = await restaurantService.getById(id);
        setInitialData(restaurantData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading restaurant data:', err);
        setError('Failed to load restaurant data');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  // Handle form submission
  async function handleSubmit(formData) {
    setLoading(true);
    
    try {
      await restaurantService.update(id, formData);
      navigate(`/restaurants/${id}`);
      return { _id: id, ...formData };
    } catch (err) {
      setError('Failed to update restaurant');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  // Handle cancel button click
  function handleCancel() {
    navigate(`/restaurants/${id}`);
  }
  
  if (loading && !initialData) return (
    <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">
      Loading restaurant data...
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Add SimpleBreadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs 
          customCrumbs={[
            { name: 'Restaurants', path: '/restaurants', current: false },
            { name: 'Restaurant Details', path: `/restaurants/${id}`, current: false },
            { name: 'Edit Restaurant', path: `/restaurants/${id}/edit`, current: true }
          ]}
        />
      </div>

      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <Heading className="mb-4 sm:mb-0">Edit Restaurant</Heading>
        
        {/* Top action buttons */}
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={handleCancel}
            negative
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => document.querySelector('form')?.requestSubmit()}
            disabled={loading}
            positive
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6">
          {error}
        </Alert>
      )}
      
      <RestaurantForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        buttonLabel="Save Changes"
        loading={loading}
      />
    </div>
  );
}
