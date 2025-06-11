import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as mealService from '../../services/meal';
import * as restaurantService from '../../services/restaurant';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './NewMealPage.css';

export default function NewMealPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    restaurantId: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null,
    isFavorite: false,
    notes: '',
    mealImages: []
  });
  
  // State for restaurants dropdown
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Load restaurants for dropdown
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const restaurantsData = await restaurantService.getAll();
        setRestaurants(restaurantsData);
      } catch (err) {
        setError('Failed to load restaurants');
      }
    }
    
    fetchRestaurants();
  }, []);
  
  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    
    try {
      const newMeal = await mealService.create(formData);
      navigate(`/meals/${newMeal._id}`);
    } catch (err) {
      setError('Failed to create meal');
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

  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }
  
  return (
    <div className="NewMealPage">
      <h1>Add New Meal</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Meal Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="restaurantId">Restaurant</label>
          <select
            id="restaurantId"
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            required
          >
            <option value="">Select a restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Would order again?</label>
          <div className="thumbs-rating">
            <button
              type="button"
              className={formData.isThumbsUp === true ? 'active' : ''}
              onClick={() => setFormData({...formData, isThumbsUp: true})}
            >
              👍 Yes
            </button>
            <button
              type="button"
              className={formData.isThumbsUp === false ? 'active' : ''}
              onClick={() => setFormData({...formData, isThumbsUp: false})}
            >
              👎 No
            </button>
          </div>
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="isFavorite"
            name="isFavorite"
            checked={formData.isFavorite}
            onChange={handleChange}
          />
          <label htmlFor="isFavorite">Mark as favorite</label>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Photos</label>
          <MultiImageUploader 
            images={formData.mealImages} 
            onImagesUpdated={handleImagesUpdated}
            entityType="meal"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            type="button" 
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={() => navigate('/meals')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Meal'}
          </button>
        </div>
      </form>
    </div>
  );
}
