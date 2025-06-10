import { useState, useEffect } from 'react';
import './MealForm.css';

export default function MealForm({ initialData, onSubmit, buttonLabel = 'Save', loading = false }) {
  // Default form values
  const defaultFormData = {
    name: '',
    restaurantId: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null,
    isFavorite: false,
    notes: '',
    imageUrl: ''
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
  
  // Handle form submission
  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit(formData);
  }
  
  return (
    <form onSubmit={handleSubmit} className="MealForm">
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
      
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Saving...' : buttonLabel}
        </button>
      </div>
    </form>
  );
}