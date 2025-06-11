import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as tagService from '../../services/tag';
import * as restaurantTagService from '../../services/restaurantTag';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './EditRestaurantPage.css';

export default function EditRestaurantPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    restaurantImages: []
  });
  
  const [tags, setTags] = useState([]);
  const [restaurantTags, setRestaurantTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch restaurant data, tags, and restaurant tags when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');
        
        console.log(`Fetching restaurant with ID: ${id}`);
        
        // Fetch restaurant data with no-cache option
        const restaurantData = await restaurantService.getById(id, true);
        console.log('Restaurant data received:', restaurantData);
        
        if (!restaurantData || !restaurantData._id) {
          throw new Error('Invalid restaurant data received');
        }
        
        // Fetch all tags
        const tagsData = await tagService.getAll();
        console.log('Tags data received:', tagsData);
        
        // Fetch tags for this restaurant
        const restaurantTagsData = await restaurantTagService.getAllForRestaurant(id);
        console.log('Restaurant tags received:', restaurantTagsData);
        
        // Update state
        setFormData({
          name: restaurantData.name || '',
          address: restaurantData.address || '',
          phone: restaurantData.phone || '',
          website: restaurantData.website || '',
          restaurantImages: restaurantData.restaurantImages || []
        });
        
        setTags(tagsData);
        setRestaurantTags(restaurantTagsData);
        setSelectedTags(restaurantTagsData.map(tag => tag._id));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data: ' + (err.message || 'Unknown error'));
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
    setLoading(true);
    
    try {
      // Update restaurant
      await restaurantService.update(id, formData);
      
      // Handle tag updates
      const currentTagIds = restaurantTags.map(tag => tag._id);
      
      // Tags to add (in selectedTags but not in currentTagIds)
      const tagsToAdd = selectedTags.filter(tagId => !currentTagIds.includes(tagId));
      
      // Tags to remove (in currentTagIds but not in selectedTags)
      const tagsToRemove = currentTagIds.filter(tagId => !selectedTags.includes(tagId));
      
      // Add new tags
      const addPromises = tagsToAdd.map(tagId => 
        restaurantTagService.create({
          restaurantId: id,
          tagId
        })
      );
      
      // Remove tags (this would require additional API to find and delete the join records)
      // This is a simplified approach - you may need to implement a method to find restaurant-tag by restaurantId and tagId
      
      await Promise.all(addPromises);
      
      navigate(`/restaurants/${id}`);
    } catch (err) {
      setError('Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  }
  
  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
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
            onClick={() => navigate(`/restaurants/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
