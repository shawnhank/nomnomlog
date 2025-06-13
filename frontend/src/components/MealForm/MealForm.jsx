import { useState, useEffect } from 'react';
import MultiImageUploader from '../MultiImageUploader/MultiImageUploader';
import TagSelector from '../TagSelector/TagSelector';
import * as tagService from '../../services/tag';
import * as mealTagService from '../../services/mealTag';
import * as restaurantService from '../../services/restaurant';
import { Combobox, ComboboxOption, ComboboxLabel } from '../catalyst/combobox';
import { Input } from '../catalyst/input';
import { Textarea } from '../catalyst/textarea';
import { Fieldset, Legend } from '../catalyst/fieldset';
import { Button } from '../catalyst/button';
import ThumbsRating from '../ThumbsRating/ThumbsRating';

export default function MealForm({ initialData, onSubmit, buttonLabel = 'Save', loading = false, onCancel }) {
  // Default form values
  const defaultFormData = {
    name: '',
    restaurantId: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null,
    notes: '',
    mealImages: [], // Changed from imageUrl to mealImages array
    tags: [] // Initialize tags as an empty array
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  // Load restaurants and tags when component mounts
  useEffect(() => {
    async function loadData() {
      try {
        // Load restaurants
        const restaurantsData = await restaurantService.getAll();
        setRestaurants(restaurantsData);

        // Load tags for this meal if editing
        if (initialData?._id) {
          const mealTags = await mealTagService.getAllForMeal(initialData._id);
          setSelectedTags(mealTags.map(mt => mt.tagId._id));
        }
      } catch (err) {
        console.error('Error loading form data:', err);
      }
    }
    
    loadData();
  }, [initialData]);

  // Set preview image when form data changes
  useEffect(() => {
    if (formData.mealImages && formData.mealImages.length > 0) {
      const primaryImage = formData.mealImages.find(img => img.isPrimary) || formData.mealImages[0];
      setPreviewImage(primaryImage.url);
    } else {
      setPreviewImage(null);
    }
  }, [formData.mealImages]);

  // Handle form input changes
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    setErrorMsg('');
  }

  // Handle tag selection changes
  function handleTagsChange(tagIds) {
    setSelectedTags(tagIds);
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
      const savedMeal = await onSubmit(formData);
      
      // Handle tags if we have a meal ID
      if (savedMeal?._id) {
        // First, remove any existing tags
        if (initialData?._id) {
          await mealTagService.deleteAllForMeal(savedMeal._id);
        }
        
        // Then add the selected tags
        const tagPromises = selectedTags.map(tagId => 
          mealTagService.create({
            mealId: savedMeal._id,
            tagId
          })
        );
        
        await Promise.all(tagPromises);
      }
    } catch (err) {
      setErrorMsg('Error saving meal');
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

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Fieldset>
          <Legend>Meal Details</Legend>

          <div className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter meal name"
              label="Meal Name"
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Restaurant
              </label>
              {restaurants.length > 0 ? (
                <Combobox
                  options={restaurants}
                  value={restaurants.find(r => r._id === formData.restaurantId) || null}
                  onChange={(restaurant) => {
                    if (restaurant) {
                      setFormData({...formData, restaurantId: restaurant._id});
                    }
                  }}
                  displayValue={(restaurant) => restaurant?.name || ''}
                  filter={(restaurant, query) => 
                    restaurant.name.toLowerCase().includes(query.toLowerCase())
                  }
                  placeholder="Select or search for a restaurant..."
                >
                  {(restaurant) => (
                    <ComboboxOption value={restaurant}>
                      <ComboboxLabel>{restaurant.name}</ComboboxLabel>
                    </ComboboxOption>
                  )}
                </Combobox>
              ) : (
                <div className="text-gray-500">Loading restaurants...</div>
              )}
            </div>

            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              label="Date"
            />
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Photos</Legend>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Meal Photos
              </label>
              <MultiImageUploader
                images={formData.mealImages}
                onImagesUpdated={handleImagesUpdated}
                entityType="meal"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Preferences</Legend>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Would order again?
              </span>
            </div>
            <ThumbsRating 
              value={formData.isThumbsUp}
              onChange={handleThumbsRating}
              size="md"
            />
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Comments</Legend>
          <div className="space-y-4">
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this meal..."
            />
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Tags</Legend>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Tags
            </label>
            <div className="w-full">
              <TagSelector
                selectedTags={selectedTags} // Use the selectedTags state
                onTagsChange={handleTagsChange} // Use the handleTagsChange function
              />
            </div>
          </div>
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
              className="font-normal"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            positive
            className="font-normal"
          >
            {loading ? 'Saving...' : buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
