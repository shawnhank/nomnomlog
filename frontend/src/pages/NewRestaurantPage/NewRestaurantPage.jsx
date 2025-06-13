import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import { Alert } from '../../components/catalyst/alert';
import { Heading } from '../../components/catalyst/heading';
import RestaurantForm from '../../components/RestaurantForm/RestaurantForm';

export default function NewRestaurantPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  
  // Handle form submission
  async function handleSubmit(formData) {
    setLoading(true);
    
    try {
      const newRestaurant = await restaurantService.create(formData);
      navigate(`/restaurants/${newRestaurant._id}`);
      return newRestaurant;
    } catch (err) {
      setErrorMsg('Failed to create restaurant');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  // Handle cancel button click
  function handleCancel() {
    navigate('/restaurants');
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Heading className="mb-6">Add New Restaurant</Heading>

      {errorMsg && (
        <Alert className="mb-6">
          {errorMsg}
        </Alert>
      )}
      
      <RestaurantForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        buttonLabel="Add Restaurant"
        loading={loading}
      />
    </div>
  );
}
