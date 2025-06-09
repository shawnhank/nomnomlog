import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as restaurantCategoryService from '../../services/restaurantCategory';
import './EditRestaurantPage.css';

export default function EditRestaurantPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    categoryId: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch restaurant data and categories when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch restaurant data
        const restaurantData = await restaurantService.getById(id);
        
        // Fetch categories for dropdown
        const categoriesData = await restaurantCategoryService.getAll();
        
        // Update state
        setFormData({
          name: restaurantData.name || '',
          address: restaurantData.address || '',
          phone: restaurantData.phone || '',
          website: restaurantData.website || '',
          categoryId: restaurantData.categoryId?._id || ''
        });
        
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurant data');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  }
  
  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Call API to update restaurant
      await restaurantService.update(id, formData);
      // Navigate back to the detail page
      navigate(`/restaurants/${id}`);
    } catch (err) {
      setError('Failed to update restaurant - Try again');
    }
  }
  
  // Show loading state
  if (loading) {
    return <div className="EditRestaurantPage loading">Loading restaurant data...</div>;
  }
  
  return (
    <div className="EditRestaurantPage">
      <h1>Edit Restaurant</h1>
      
      {error && <p className="error-message">{error}</p>}
      
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
            onClick={() => navigate(`/restaurants/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="btn-save">Save Changes</button>
        </div>
      </form>
    </div>
  );
}