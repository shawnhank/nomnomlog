import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as mealService from '../../services/meal';
import { Alert } from '../../components/catalyst/alert';
import MealForm from '../../components/MealForm/MealForm';

export default function NewMealPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Handle form submission
  async function handleSubmit(formData) {
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
  
  // Handle cancel button click
  function handleCancel() {
    navigate('/meals');
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Add New Meal</h1>

      {error && (
        <Alert className="mb-6">
          {error}
        </Alert>
      )}
      
      <MealForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        buttonLabel="Save Meal"
        loading={loading}
      />
    </div>
  );
}
