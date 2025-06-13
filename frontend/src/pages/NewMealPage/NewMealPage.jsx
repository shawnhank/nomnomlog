import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as mealService from '../../services/meal';
import * as restaurantService from '../../services/restaurant';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Select } from '../../components/catalyst/select';
import { Textarea } from '../../components/catalyst/textarea';
import { Fieldset, Legend } from '../../components/catalyst/fieldset';
import { Alert } from '../../components/catalyst/alert';
import { Checkbox } from '../../components/catalyst/checkbox';

export default function NewMealPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    restaurantId: '',
    date: new Date().toISOString().split('T')[0],
    isThumbsUp: null,
    isFavorite: false,
    notes: '',
    mealImages: []
  });
  
  // State for restaurants dropdown
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Load restaurants for dropdown
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const restaurantsData = await restaurantService.getAll();
        setRestaurants(restaurantsData);
      } catch (err) {
        setError('Failed to load restaurants');
      }
    }
    
    fetchRestaurants();
  }, []);
  
  // Handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    
    try {
      const newMeal = await mealService.create(formData);
      navigate(`/meals/${newMeal._id}`);
    } catch (err) {
      setError('Failed to create meal');
    } finally {
      setLoading(false);
    }
  }
  
  // Handle form input changes
  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' 
      ? checked 
      : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  }

  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Add New Meal</h1>

      {error && (
        <Alert className="mb-6">
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Fieldset>
          <Legend>Meal Name</Legend>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter meal name"
          />
        </Fieldset>

        <Fieldset>
          <Legend>Restaurant</Legend>
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
        </Fieldset>

        <Fieldset>
          <Legend>Date</Legend>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Fieldset>

        <Fieldset>
          <Legend>Would Order Again?</Legend>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, isThumbsUp: true})}
              className={`px-3 py-2 sm:px-4 rounded-md flex items-center gap-2 text-sm transition-colors ${
                formData.isThumbsUp === true
                  ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <span>👍</span>
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, isThumbsUp: false})}
              className={`px-3 py-2 sm:px-4 rounded-md flex items-center gap-2 text-sm transition-colors ${
                formData.isThumbsUp === false
                  ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <span>👎</span>
              <span>No</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, isThumbsUp: null})}
              className={`px-3 py-2 sm:px-4 rounded-md text-sm transition-colors ${
                formData.isThumbsUp === null
                  ? 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <span>Clear</span>
            </button>
          </div>
        </Fieldset>

        <Fieldset>
          <Checkbox
            name="isFavorite"
            checked={formData.isFavorite}
            onChange={handleChange}
          >
            Mark as favorite
          </Checkbox>
        </Fieldset>

        <Fieldset>
          <Legend>Notes</Legend>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Add any notes about this meal..."
          />
        </Fieldset>

        <Fieldset>
          <Legend>Meal Photos</Legend>
          <MultiImageUploader
            images={formData.mealImages}
            onImagesUpdated={handleImagesUpdated}
            entityType="meal"
          />
        </Fieldset>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            color="white"
            onClick={() => navigate('/meals')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Saving...' : 'Save Meal'}
          </Button>
        </div>
      </form>
    </div>
  );
}
