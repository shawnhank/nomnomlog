import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as mealService from '../../services/meal';
import * as restaurantService from '../../services/restaurant';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './EditMealPage.css';

export default function EditMealPage() {
  const [formData, setFormData] = useState({
    name: '',
    restaurantId: '',
    date: '',
    isThumbsUp: null,
    isFavorite: false,
    notes: '',
    mealImages: []
  });
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Load meal data and restaurants
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get meal data
        const meal = await mealService.getById(id);
        
        // Convert legacy imageUrl to mealImages if needed
        let mealImages = meal.mealImages || [];
        if (meal.imageUrl && mealImages.length === 0) {
          mealImages = [{
            url: meal.imageUrl,
            isPrimary: true,
            caption: ''
          }];
        }
        
        // Get restaurants for dropdown
        const restaurantsData = await restaurantService.getAll();
        setRestaurants(restaurantsData);
        
        // Ensure we're using the restaurant ID correctly
        // If restaurantId is an object with _id, use that, otherwise use the value directly
        const restaurantId = typeof meal.restaurantId === 'object' && meal.restaurantId?._id 
          ? meal.restaurantId._id 
          : meal.restaurantId;
        
        setFormData({
          name: meal.name,
          restaurantId: restaurantId,
          date: new Date(meal.date).toISOString().split('T')[0],
          isThumbsUp: meal.isThumbsUp,
          notes: meal.notes || '',
          mealImages
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading meal data:', err);
        setError('Failed to load meal data');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    
    try {
      await mealService.update(id, formData);
      navigate(`/meals/${id}`);
    } catch (err) {
      setError('Failed to update meal');
    } finally {
      setLoading(false);
    }
  }
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' 
      ? checked 
      : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  }
  
  // Handle thumbs rating
  function handleThumbsChange(isThumbsUp) {
    setFormData({
      ...formData,
      isThumbsUp
    });
  }
  
  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }
  
  if (loading) return <div className="flex justify-center items-center h-64">Loading meal data...</div>;
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Meal</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Meal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant
          </label>
          <select
            id="restaurantId"
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Would Order Again?</span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleThumbsChange(true)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                formData.isThumbsUp === true
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <span>👍</span>
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => handleThumbsChange(false)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                formData.isThumbsUp === false
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <span>👎</span>
              <span>No</span>
            </button>
            <button
              type="button"
              onClick={() => handleThumbsChange(null)}
              className={`px-4 py-2 rounded-md ${
                formData.isThumbsUp === null
                  ? 'bg-gray-100 text-gray-800 border border-gray-300'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <span>Clear</span>
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Photos
          </label>
          <MultiImageUploader 
            images={formData.mealImages} 
            onImagesUpdated={handleImagesUpdated}
            entityType="meal"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        
          <button
            type="button"
            onClick={() => navigate(`/meals/${id}`)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
