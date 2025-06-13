import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as tagService from '../../services/tag';
import * as restaurantTagService from '../../services/restaurantTag';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Checkbox } from '../../components/catalyst/checkbox';
import { Fieldset, Legend } from '../../components/catalyst/fieldset';
import { Heading } from '../../components/catalyst/heading';

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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Heading>Add New Restaurant</Heading>

      {errorMsg && (
        <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Fieldset>
          <Legend>Restaurant Information</Legend>
          <div className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter restaurant name"
            />

            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter restaurant address"
            />

            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <Input
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Photos</Legend>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Restaurant Photos
            </label>
            <MultiImageUploader
              images={formData.restaurantImages}
              onImagesUpdated={handleImagesUpdated}
              entityType="restaurant"
            />
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Tags</Legend>
          <div className="space-y-4">
            {tags.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tags.map(tag => (
                  <Checkbox
                    key={tag._id}
                    name={`tag-${tag._id}`}
                    checked={selectedTags.includes(tag._id)}
                    onChange={() => handleTagSelect(tag._id)}
                  >
                    {tag.name}
                  </Checkbox>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={handleNewTagChange}
                placeholder="Add a new tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleCreateTag}
                color="zinc"
                outline
              >
                Add
              </Button>
            </div>
          </div>
        </Fieldset>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            color="zinc"
            outline
            onClick={() => navigate('/restaurants')}
            className="sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="blue"
            className="flex-1 sm:flex-none"
          >
            Add Restaurant
          </Button>
        </div>
      </form>
    </div>
  );
}
