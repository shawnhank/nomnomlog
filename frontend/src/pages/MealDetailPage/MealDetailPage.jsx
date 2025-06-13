import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, HandThumbDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';

export default function MealDetailPage() {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch meal details when component mounts
  useEffect(() => {
    async function fetchMeal() {
      try {
        setLoading(true);
        const mealData = await mealService.getById(id);
        
        // Convert legacy imageUrl to mealImages if needed
        if (mealData.imageUrl && (!mealData.mealImages || mealData.mealImages.length === 0)) {
          mealData.mealImages = [{
            url: mealData.imageUrl,
            isPrimary: true,
            caption: ''
          }];
        }
        
        setMeal(mealData);
      } catch (err) {
        setError('Failed to load meal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id]);

  // Handle delete meal
  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await mealService.deleteMeal(id);
        navigate('/meals');
      } catch (err) {
        setError('Failed to delete meal');
      }
    }
  }

  // Handle toggle favorite
  async function handleToggleFavorite() {
    try {
      const updatedMeal = await mealService.toggleFavorite(id);
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to update favorite status');
    }
  }

  // Handle thumbs rating with toggle functionality
  async function handleThumbsRating(isThumbsUp) {
    try {
      const updatedMeal = await mealService.setThumbsRating(id, isThumbsUp);
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to update thumbs rating');
    }
  }

  // Add this function to handle edit navigation
  function handleEdit() {
    navigate(`/meals/${id}/edit`);
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading meal details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!meal) return <div className="text-gray-600 p-4">Meal not found</div>;

  // Find primary image if available
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? (meal.mealImages.find(img => img.isPrimary) || meal.mealImages[0])
    : null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header with meal name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{meal.name}</h1>
        <div className="flex gap-3">
          <Link 
            to="/meals/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span>Add Meal</span>
          </Link>
          <button 
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            className="bg-white hover:bg-red-50 text-red-600 border border-red-600 px-4 py-2 rounded-md text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Meal details */}
      <div className="space-y-6">
        {/* Restaurant and date info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meal.restaurantId && (
            <div>
              <p className="text-gray-600 font-medium mb-1">Restaurant</p>
              <Link 
                to={`/restaurants/${meal.restaurantId._id}`}
                className="text-blue-600 hover:underline"
              >
                {meal.restaurantId.name}
              </Link>
            </div>
          )}
          <div>
            <p className="text-gray-600 font-medium mb-1">Date</p>
            <p>{new Date(meal.date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Meal actions (thumbs only) */}
        <div className="flex gap-3 my-4">
          {/* Thumbs up button */}
          <button 
            onClick={() => handleThumbsRating(true)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              meal.isThumbsUp === true 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-800 hover:bg-gray-700'
            } text-white transition-colors`}
            title="Would Order Again"
          >
            {meal.isThumbsUp === true ? (
              <HandThumbUpSolid className="w-6 h-6" />
            ) : (
              <HandThumbUpIcon className="w-6 h-6" />
            )}
          </button>
          
          {/* Thumbs down button */}
          <button 
            onClick={() => handleThumbsRating(false)}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              meal.isThumbsUp === false 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-800 hover:bg-gray-700'
            } text-white transition-colors`}
            title="Would Not Order Again"
          >
            {meal.isThumbsUp === false ? (
              <HandThumbDownSolid className="w-6 h-6" />
            ) : (
              <HandThumbDownIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Primary image display */}
        {primaryImage && (
          <div className="my-6">
            <img 
              src={primaryImage.url} 
              alt={meal.name} 
              className="w-full max-h-96 object-cover rounded-lg shadow-md"
            />
            {primaryImage.caption && (
              <p className="text-sm text-gray-600 mt-1">
                {primaryImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        {meal.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{meal.notes}</p>
          </div>
        )}

        {/* Image gallery (if there are multiple images) */}
        {meal.mealImages && meal.mealImages.length > 1 && (
          <div className="my-6">
            <h3 className="text-lg font-medium mb-2">Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {meal.mealImages.map((image, index) => (
                <div key={index} className="aspect-square">
                  <img 
                    src={image.url} 
                    alt={image.caption || `${meal.name} photo ${index + 1}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={handleEdit}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <span>Manage Photos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
