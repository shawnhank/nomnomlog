import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import { Alert } from '../../components/catalyst/alert';
import RestaurantForm from '../../components/RestaurantForm/RestaurantForm';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
import YelpSearchAutocomplete from '../../components/YelpSearchAutocomplete/YelpSearchAutocomplete';

export default function NewRestaurantPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Handle form submission
  async function handleSubmit(formData) {
    setLoading(true);
    
    try {
      const newRestaurant = await restaurantService.create(formData);
      navigate(`/restaurants/${newRestaurant._id}`);
    } catch (err) {
      setError('Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  }
  
  // Handle cancel button click
  function handleCancel() {
    navigate('/restaurants');
  }

  // Add this function to handle selecting a restaurant from Yelp
  const handleSelectYelpRestaurant = (restaurantData) => {
    // Update form state with Yelp data
    setFormData({
      ...formData,
      name: restaurantData.name,
      address: restaurantData.address,
      phone: restaurantData.phone,
      website: restaurantData.website,
      lat: restaurantData.lat,
      long: restaurantData.long,
      yelpId: restaurantData.yelpId
    });
    
    // If there are images, update the images state
    if (restaurantData.restaurantImages && restaurantData.restaurantImages.length > 0) {
      setImages(restaurantData.restaurantImages);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Add SimpleBreadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs 
          customCrumbs={[
            { name: 'Restaurants', path: '/restaurants', current: false },
            { name: 'Add New Restaurant', path: '/restaurants/new', current: true }
          ]}
        />
      </div>

      <h1 className="text-2xl font-bold mb-6">Add New Restaurant</h1>
      
      <YelpSearchAutocomplete onSelectRestaurant={handleSelectYelpRestaurant} />
      
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <RestaurantForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
