import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as tagService from '../../services/tag';
import * as restaurantTagService from '../../services/restaurantTag';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './NewRestaurantPage.css';

export default function NewRestaurantPage() {
  // State for the restaurant form data
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    restaurantImages: []
  });
  
  // State for tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  // State for error message
  const [errorMsg, setErrorMsg] = useState('');
  
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Fetch tags when component mounts
  useEffect(() => {
    async function fetchTags() {
      try {
        const tagsData = await tagService.getAll();
        setTags(tagsData);
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    }
    
    fetchTags();
  }, []);
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    setErrorMsg('');
  }
  
  // Handle tag selection
  function handleTagSelect(tagId) {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  }
  
  // Handle new tag input
  function handleNewTagChange(evt) {
    setNewTag(evt.target.value);
  }
  
  // Create a new tag
  async function handleCreateTag() {
    if (!newTag.trim()) return;
    
    try {
      const createdTag = await tagService.create({ name: newTag });
      setTags([...tags, createdTag]);
      setSelectedTags([...selectedTags, createdTag._id]);
      setNewTag('');
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  }
  
  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Call API to create new restaurant
      const newRestaurant = await restaurantService.create(formData);
      
      // Create restaurant-tag relationships for selected tags
      const tagPromises = selectedTags.map(tagId => 
        restaurantTagService.create({
          restaurantId: newRestaurant._id,
          tagId
        })
      );
      
      await Promise.all(tagPromises);
      
      // Navigate to the detail page for the new restaurant
      navigate(`/restaurants/${newRestaurant._id}`);
    } catch (err) {
      setErrorMsg('Failed to create restaurant - Try again');
    }
  }
  
  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }

  return (
    <div className="NewRestaurantPage">
      <h1>Add New Restaurant</h1>
      
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      
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
        
        {/* Add MultiImageUploader */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Photos</label>
          <MultiImageUploader 
            images={formData.restaurantImages} 
            onImagesUpdated={handleImagesUpdated}
            entityType="restaurant"
          />
        </div>
        
        {/* Tags section */}
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-container">
            {tags.map(tag => (
              <div key={tag._id} className="tag-item">
                <input
                  type="checkbox"
                  id={`tag-${tag._id}`}
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleTagSelect(tag._id)}
                />
                <label htmlFor={`tag-${tag._id}`}>{tag.name}</label>
              </div>
            ))}
          </div>
          
          {/* Add new tag */}
          <div className="add-tag-container">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              placeholder="Add a new tag"
            />
            <button 
              type="button" 
              onClick={handleCreateTag}
              className="btn-add-tag"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/restaurants')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Add Restaurant
          </button>
        </div>
      </form>
    </div>
  );
}
