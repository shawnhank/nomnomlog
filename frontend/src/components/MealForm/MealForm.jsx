import { useState, useEffect } from 'react';
import MultiImageUploader from '../MultiImageUploader/MultiImageUploader';
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
  
  // Initialize with provided data or defaults
  const [formData, setFormData] = useState({...defaultFormData, ...initialData});
  const [restaurants, setRestaurants] = useState([]);
  
  // Load restaurants for dropdown (assuming restaurant service is passed or imported)
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        // This would need to be adjusted based on how restaurant service is provided
        const restaurantService = await import('../../services/restaurant');
        const restaurantsData = await restaurantService.getAll();
        setRestaurants(restaurantsData);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      }
    }
    
    fetchRestaurants();
  }, []);
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  }
  
  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }
  
  // Handle form submission
  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit(formData);
  }
  
  // Convert legacy imageUrl to mealImages if needed (for backward compatibility)
  useEffect(() => {
    if (initialData && initialData.imageUrl && (!initialData.mealImages || initialData.mealImages.length === 0)) {
      setFormData(prev => ({
        ...prev,
        mealImages: [{
          url: initialData.imageUrl,
          isPrimary: true,
          caption: ''
        }]
      }));
    }
  }, [initialData]);
  
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
          <Legend>Preferences</Legend>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Would order again?
              </label>
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
          </div>
        </Fieldset>

        <Fieldset>
          <Legend>Photos & Notes</Legend>

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

            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this meal..."
            />
          </div>
        </Fieldset>

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
