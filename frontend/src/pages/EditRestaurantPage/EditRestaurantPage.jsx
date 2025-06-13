import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as tagService from '../../services/tag';
import * as restaurantTagService from '../../services/restaurantTag';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Fieldset, Legend } from '../../components/catalyst/fieldset';
import { Alert } from '../../components/catalyst/alert';
import { Checkbox } from '../../components/catalyst/checkbox';

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
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">
        Loading restaurant data...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Restaurant</h1>

      {error && (
        <Alert className="mb-6">
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Fieldset>
          <Legend>Restaurant Name</Legend>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter restaurant name"
          />
        </Fieldset>

        <Fieldset>
          <Legend>Address</Legend>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter restaurant address"
          />
        </Fieldset>

        <Fieldset>
          <Legend>Phone</Legend>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </Fieldset>

        <Fieldset>
          <Legend>Website</Legend>
          <Input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </Fieldset>

        <Fieldset>
          <Legend>Restaurant Photos</Legend>
          <MultiImageUploader
            images={formData.restaurantImages}
            onImagesUpdated={handleImagesUpdated}
            entityType="restaurant"
          />
        </Fieldset>

        <Fieldset>
          <Legend>Tags</Legend>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tags.map(tag => (
                <Checkbox
                  key={tag._id}
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleTagSelect(tag._id)}
                >
                  {tag.name}
                </Checkbox>
              ))}
            </div>

            {/* Add new tag */}
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Input
                value={newTag}
                onChange={handleNewTagChange}
                placeholder="Add a new tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleCreateTag}
                color="blue"
              >
                Add
              </Button>
            </div>
          </div>
        </Fieldset>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            color="white"
            onClick={() => navigate(`/restaurants/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
