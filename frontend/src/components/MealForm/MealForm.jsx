
import { useState, useEffect, useRef } from 'react';
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
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const addImageButtonRef = useRef(null);

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
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white">Meal Details</Legend>

          <div className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meal Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter meal name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full"
                >
                  {(restaurant) => (
                    <ComboboxOption value={restaurant}>
                      <ComboboxLabel>{restaurant.name}</ComboboxLabel>
                    </ComboboxOption>
                  )}
                </Combobox>
              ) : (
                <div className="text-gray-500 p-2 border rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">Loading restaurants...</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white flex justify-between items-center">
            Order Again?
            <ThumbsRating 
              value={formData.isThumbsUp}
              onChange={handleThumbsRating}
              size="lg"
              className="mr-2" 
            />
          </Legend>
        </Fieldset>

        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white">Notes</Legend>
          <div className="mt-2">
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this meal..."
              className="w-full"
            />
          </div>
        </Fieldset>

        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white">Tags</Legend>
          <div className="-mt-2">
            <TagSelector
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
            />
          </div>
        </Fieldset>

        <Fieldset className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Legend className="text-lg font-medium text-gray-900 dark:text-white flex justify-between items-center">
            Photos
            <Button
              type="button"
              onClick={() => addImageButtonRef.current?.handleAddImageClick()}
              color="blue"
              outline
              className="text-sm border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 -mr-2"
            >
              <span className="flex items-center">
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                Add Image
              </span>
            </Button>
          </Legend>
          <div className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-700">
              <MultiImageUploader
                images={formData.mealImages}
                onImagesUpdated={handleImagesUpdated}
                entityType="meal"
                renderAddButton={false}
                addButtonRef={addImageButtonRef}
              />
            </div>
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
