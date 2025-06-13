import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import { Alert } from '../../components/catalyst/alert';
import { Heading } from '../../components/catalyst/heading';
import { Button } from '../../components/catalyst/button';
import RestaurantForm from '../../components/RestaurantForm/RestaurantForm';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
import YelpSearchAutocomplete from '../../components/YelpSearchAutocomplete/YelpSearchAutocomplete';

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
  
  // Add this function to handle selecting a restaurant from Yelp
  const handleSelectYelpRestaurant = (restaurantData) => {
    // Update form state with Yelp data
    setFormData({
      ...formData,
      yelpId: restaurantData.yelpId
    });
    
    // Optionally update other fields if they're empty
    if (!formData.website && restaurantData.website) {
      setFormData(prev => ({ ...prev, website: restaurantData.website }));
    }
    
    if (!formData.phone && restaurantData.phone) {
      setFormData(prev => ({ ...prev, phone: restaurantData.phone }));
    }
    
    // If there are images and we don't have any, update the images
    if (restaurantData.restaurantImages?.length > 0 && (!images || images.length === 0)) {
      setImages(restaurantData.restaurantImages);
    }
  };

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

      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Link to Yelp</h3>
        <p className="text-sm text-gray-600 mb-4">
          Search for this restaurant on Yelp to link it and import additional data.
        </p>
        
        <YelpSearchAutocomplete onSelectRestaurant={handleSelectYelpRestaurant} />
        
        {formData.yelpId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Restaurant linked to Yelp</span>
            </div>
            <a 
              href={`https://www.yelp.com/biz/${formData.yelpId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >
              View on Yelp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
