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
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';

export default function MealForm({ initialData, onSubmit, buttonLabel = 'Save', loading = false, onCancel }) {
  // Default form values
  const defaultFormData = {
    name: '',
    restaurantId: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null,
    notes: '',
    mealImages: [] // Changed from imageUrl to mealImages array
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Legend className="mb-0 mr-2">Preferences</Legend>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Would order again?
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  // Toggle between true and null
                  const newValue = formData.isThumbsUp === true ? null : true;
                  setFormData({...formData, isThumbsUp: newValue});
                }}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center ${
                  formData.isThumbsUp === true 
                    ? "bg-blue-500 border-blue-500 text-white" 
                    : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {formData.isThumbsUp === true ? (
                  <HandThumbUpSolid className="w-5 h-5 mr-1" />
                ) : (
                  <HandThumbUpIcon className="w-5 h-5 mr-1" />
                )}
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  // Toggle between false and null
                  const newValue = formData.isThumbsUp === false ? null : false;
                  setFormData({...formData, isThumbsUp: newValue});
                }}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center ${
                  formData.isThumbsUp === false 
                    ? "bg-red-500 border-red-500 text-white" 
                    : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >
                {formData.isThumbsUp === false ? (
                  <HandThumbDownSolid className="w-5 h-5 mr-1" />
                ) : (
                  <HandThumbDownIcon className="w-5 h-5 mr-1" />
                )}
                No
              </button>
            </div>
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
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
