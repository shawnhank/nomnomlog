import { useState, useEffect } from 'react';
import './MealForm.css'; // Keep this for any custom styles
import MultiImageUploader from '../MultiImageUploader/MultiImageUploader'; // Updated import

export default function MealForm({ initialData, onSubmit, buttonLabel = 'Save', loading = false }) {
  // Default form values
  const defaultFormData = {
    name: '',
    restaurantId: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null,
    isFavorite: false,
    notes: '',
    mealImages: [] // Changed from imageUrl to mealImages array
  };
  
  // Initialize with provided data or defaults
  const [formData, setFormData] = useState({...defaultFormData, ...initialData});
  const [restaurants, setRestaurants] = useState([]);
  
  // Load restaurants for dropdown (assuming restaurant service is passed or imported)
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        // This would need to be adjusted based on how restaurant service is provided
        const restaurantService = await import('../../services/restaurant');
        const restaurantsData = await restaurantService.getAll();
        setRestaurants(restaurantsData);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      }
    }
    
    fetchRestaurants();
  }, []);
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  }
  
  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }
  
  // Handle form submission
  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit(formData);
  }
  
  // Convert legacy imageUrl to mealImages if needed (for backward compatibility)
  useEffect(() => {
    if (initialData && initialData.imageUrl && (!initialData.mealImages || initialData.mealImages.length === 0)) {
      setFormData(prev => ({
        ...prev,
        mealImages: [{
          url: initialData.imageUrl,
          isPrimary: true,
          caption: ''
        }]
      }));
    }
  }, [initialData]);
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-1">Restaurant</label>
        <select
          id="restaurantId"
          name="restaurantId"
          value={formData.restaurantId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select a restaurant</option>
          {restaurants.map(restaurant => (
            <option key={restaurant._id} value={restaurant._id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Would order again?</label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${formData.isThumbsUp === true ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary`}
            onClick={() => setFormData({...formData, isThumbsUp: true})}
          >
            👍 Yes
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${formData.isThumbsUp === false ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary`}
            onClick={() => setFormData({...formData, isThumbsUp: false})}
          >
            👎 No
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <input
          type="checkbox"
          id="isFavorite"
          name="isFavorite"
          checked={formData.isFavorite}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="isFavorite" className="text-sm font-medium text-gray-700">Mark as favorite</label>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Photos</label>
        <MultiImageUploader 
          images={formData.mealImages} 
          onImagesUpdated={handleImagesUpdated}
          entityType="meal"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <button 
          type="submit" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : buttonLabel}
        </button>
      </div>
    </form>
  );
}
