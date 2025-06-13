import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as mealService from '../../services/meal';
import { Alert } from '../../components/catalyst/alert';
import MealForm from '../../components/MealForm/MealForm';

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Meal</h1>

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
