import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import * as tagService from '../../services/tag';
import * as restaurantTagService from '../../services/restaurantTag';
import MultiImageUploader from '../MultiImageUploader/MultiImageUploader';
import TagSelector from '../TagSelector/TagSelector';
import { Input } from '../catalyst/input';
import { Textarea } from '../catalyst/textarea';
import { Fieldset, Legend } from '../catalyst/fieldset';
import { Button } from '../catalyst/button';
import ThumbsRating from '../ThumbsRating/ThumbsRating';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function RestaurantForm({ initialData, onSubmit, buttonLabel = 'Save', loading = false, onCancel }) {
  // Default form values
  const defaultFormData = {
    name: '',
    address: '',
    phone: '',
    website: '',
    restaurantImages: [],
    notes: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null
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

  // Handle thumbs rating changes
  function handleThumbsRating(newValue) {
    setFormData({ ...formData, isThumbsUp: newValue });
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

  const addImageButtonRef = useRef(null);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white px-1">Restaurant Information</Legend>
          
          <div className="space-y-5 mt-4">
            <div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter restaurant name"
                required
                label="Name"
                className="w-full"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              />
            </div>
            
            <div>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter restaurant address"
                label="Address"
                className="w-full"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              />
            </div>
            
            <div>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                label="Phone"
                className="w-full"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              />
            </div>
            
            <div>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                label="Website"
                className="w-full"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              />
            </div>
            
            <div>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                label="First Visited"
                className="w-full"
                labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white flex justify-between items-center px-1">
            Photos
            <div className="-mr-2">
              <Button
                type="button"
                onClick={() => addImageButtonRef?.current?.handleAddImageClick()}
                color="blue"
                outline
                className="text-sm border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-20 mr-2"
              >
                <span className="flex items-center">
                  <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                  Add Image
                </span>
              </Button>
            </div>
          </Legend>

          <div className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-700">
              <MultiImageUploader
                images={formData.restaurantImages}
                onImagesUpdated={handleImagesUpdated}
                entityType="restaurant"
                renderAddButton={false}
                addButtonRef={addImageButtonRef}
              />
            </div>
          </div>
        </Fieldset>
        
        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white flex justify-between items-center px-1">
            Preferences
            <ThumbsRating 
              value={formData.isThumbsUp}
              onChange={handleThumbsRating}
              size="lg"
              className="mr-2"
            />
          </Legend>
        </Fieldset>
        
        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white px-1">Comments</Legend>
          <div className="mt-4">
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this restaurant..."
              className="w-full"
              labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            />
          </div>
        </Fieldset>

        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white px-2">Tags</Legend>
          <div className="mt-1">
            <TagSelector 
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
            />
          </div>
        </Fieldset>

        {errorMsg && (
          <p className="text-red-600 font-medium">{errorMsg}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              negative
              className="px-4 py-2 text-sm font-medium rounded-md"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            positive
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            {loading ? 'Saving...' : buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
