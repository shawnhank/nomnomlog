import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as restaurantCategoryService from '../../services/restaurantCategory';
import './NewRestaurantPage.css';

export default function NewRestaurantPage() {
  // State for the restaurant form data
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    categoryId: ''
  });
  
  // State for restaurant categories (for dropdown)
  const [categories, setCategories] = useState([]);
  
  // State for error message
  const [errorMsg, setErrorMsg] = useState('');
  
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Fetch restaurant categories when component mounts
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await restaurantCategoryService.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load restaurant categories:', err);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    setErrorMsg('');
  }
  
  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Call API to create new restaurant
      const newRestaurant = await restaurantService.create(formData);
      // Navigate to the detail page for the new restaurant
      navigate(`/restaurants/${newRestaurant._id}`);
    } catch (err) {
      setErrorMsg('Failed to create restaurant - Try again');
    }
  }
  
  return (
    <div className="NewRestaurantPage">
      <h1>Add New Restaurant</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Restaurant Name field (required) */}
        <div className="form-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Address field (optional) */}
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        {/* Phone field (optional) */}
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        {/* Website field (optional) */}
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>
        
        {/* Category dropdown (optional) */}
        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">-- Select a Category --</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.displayName}
              </option>
            ))}
          </select>
        </div>
        
        {/* Action buttons */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/restaurants')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit">Add Restaurant</button>
        </div>
        
        {/* Error message display */}
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>
    </div>
  );
}
