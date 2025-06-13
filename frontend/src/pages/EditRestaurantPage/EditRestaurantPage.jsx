import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import { Alert } from '../../components/catalyst/alert';
import { Heading } from '../../components/catalyst/heading';
import RestaurantForm from '../../components/RestaurantForm/RestaurantForm';

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
      <Heading className="mb-6">Edit Restaurant</Heading>

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
