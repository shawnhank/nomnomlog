import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as tagService from '../../services/tag';
import * as restaurantTagService from '../../services/restaurantTag';
import MultiImageUploader from '../MultiImageUploader/MultiImageUploader';
import TagSelector from '../TagSelector/TagSelector';
import { Input } from '../catalyst/input';
import { Textarea } from '../catalyst/textarea';
import { Fieldset, Legend } from '../catalyst/fieldset';
import { Button } from '../catalyst/button';

export default function RestaurantForm({ initialData, onSubmit, buttonLabel = 'Save', loading = false, onCancel }) {
  // Default form values
  const defaultFormData = {
    name: '',
    address: '',
    phone: '',
    website: '',
    restaurantImages: []
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Load tags if we have initial data
  useEffect(() => {
    async function loadTags() {
      if (initialData?._id) {
        try {
          const tags = await restaurantTagService.getByRestaurantId(initialData._id);
          setSelectedTags(tags.map(tag => tag.tagId._id));
        } catch (err) {
          console.error('Error loading tags:', err);
        }
      }
    }
    
    loadTags();
  }, [initialData]);

  // Handle input changes
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Submit the form data
      const savedRestaurant = await onSubmit(formData);
      
      // Handle tags if we have a restaurant ID
      if (savedRestaurant?._id) {
        // First, remove any existing tags
        if (initialData?._id) {
          await restaurantTagService.deleteAllForRestaurant(savedRestaurant._id);
        }
        
        // Then add the selected tags
        const tagPromises = selectedTags.map(tagId => 
          restaurantTagService.create({
            restaurantId: savedRestaurant._id,
            tagId
          })
        );
        
        await Promise.all(tagPromises);
      }
    } catch (err) {
      setErrorMsg('Error saving restaurant');
      console.error(err);
    }
  }

  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }
  
  // Handle tag selection changes
  function handleTagsChange(newSelectedTags) {
    setSelectedTags(newSelectedTags);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Legend>Restaurant Information</Legend>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter restaurant name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter restaurant address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Phone
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Website
              </label>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Photos</Legend>

          <div className="space-y-4">
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
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Tags</Legend>
          <TagSelector 
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
          />
        </Fieldset>

        {errorMsg && (
          <p className="text-red-600">{errorMsg}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              negative
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            positive
          >
            {loading ? 'Saving...' : buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
