import { useState, useEffect } from 'react';
import MultiImageUploader from '../MultiImageUploader/MultiImageUploader';
import TagSelector from '../TagSelector/TagSelector';
import * as tagService from '../../services/tag';
import * as mealTagService from '../../services/mealTag';
import { Button } from '../catalyst/button';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';
import { Textarea } from '../catalyst/textarea';
import { Fieldset, Legend } from '../catalyst/fieldset';
import { Checkbox } from '../catalyst/checkbox';

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
        // Load restaurants (assuming this is already implemented)
        // ...

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

            <Select
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleChange}
              required
            >
              <option value="">Select a restaurant</option>
              {restaurants.map(restaurant => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </Select>

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
              <Button
                type="button"
                color={formData.isThumbsUp === true ? 'green' : 'zinc'}
                outline={formData.isThumbsUp !== true}
                onClick={() => setFormData({...formData, isThumbsUp: true})}
              >
                👍 Yes
              </Button>
              <Button
                type="button"
                color={formData.isThumbsUp === false ? 'red' : 'zinc'}
                outline={formData.isThumbsUp !== false}
                onClick={() => setFormData({...formData, isThumbsUp: false})}
              >
                👎 No
              </Button>
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
            <Button
              type="button"
              color="zinc"
              outline
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            color="blue"
            disabled={loading}
          >
            {loading ? 'Saving...' : buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
