import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as mealService from '../../services/meal';
import { Alert } from '../../components/catalyst/alert';
import { Button } from '../../components/catalyst/button';
import MealForm from '../../components/MealForm/MealForm';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';

export default function EditMealPage() {
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Load meal data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get meal data
        const meal = await mealService.getById(id);
        
        // Convert legacy imageUrl to mealImages if needed
        let mealImages = meal.mealImages || [];
        if (meal.imageUrl && mealImages.length === 0) {
          mealImages = [{
            url: meal.imageUrl,
            isPrimary: true,
            caption: ''
          }];
        }
        
        // Ensure we're using the restaurant ID correctly
        const restaurantId = typeof meal.restaurantId === 'object' && meal.restaurantId?._id 
          ? meal.restaurantId._id 
          : meal.restaurantId;
        
        setInitialData({
          name: meal.name,
          restaurantId: restaurantId,
          date: new Date(meal.date).toISOString().split('T')[0],
          isThumbsUp: meal.isThumbsUp,
          notes: meal.notes || '',
          mealImages
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading meal data:', err);
        setError('Failed to load meal data');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  // Handle form submission
  async function handleSubmit(formData) {
    setLoading(true);
    
    try {
      await mealService.update(id, formData);
      navigate(`/meals/${id}`);
    } catch (err) {
      setError('Failed to update meal');
    } finally {
      setLoading(false);
    }
  }
  
  // Handle cancel button click
  function handleCancel() {
    navigate(`/meals/${id}`);
  }
  
  if (loading && !initialData) return (
    <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-400">
      Loading meal data...
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Add SimpleBreadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs 
          customCrumbs={[
            { name: 'Meals', path: '/meals', current: false },
            { name: 'Meal Details', path: `/meals/${id}`, current: false },
            { name: 'Edit Meal', path: `/meals/${id}/edit`, current: true }
          ]}
        />
      </div>

      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0 text-gray-900 dark:text-white">Edit Meal</h1>
        
        {/* Top action buttons */}
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={handleCancel}
            negative
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => document.querySelector('form')?.requestSubmit()}
            disabled={loading}
            positive
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6">
          {error}
        </Alert>
      )}
      
      <MealForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        buttonLabel="Save Changes"
        loading={loading}
      />
    </div>
  );
}
