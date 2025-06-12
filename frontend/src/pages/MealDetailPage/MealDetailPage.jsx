import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './MealDetailPage.css';

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

  // Handle image updates
  async function handleImagesUpdated(updatedData) {
    try {
      const updatedMeal = await mealService.update(id, {
        ...meal,
        ...updatedData
      });
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to update meal images');
    }
  }

  // Add this function to handle edit navigation
  function handleEdit() {
    navigate(`/meals/${id}/edit`);
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading meal details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!meal) return <div className="text-gray-600 p-4">Meal not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header with meal name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{meal.name}</h1>
        <div className="flex gap-3">
          <Link 
            to="/meals/new"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Add New Meal
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

        {/* Meal actions (favorite and thumbs) */}
        <div className="action-buttons-container">
          {/* Favorite button */}
          <button 
            onClick={handleToggleFavorite}
            className="action-button"
            title={meal.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span className={`heart-icon ${meal.isFavorite ? 'filled' : ''}`}>
              {meal.isFavorite ? (
                <HeartSolid style={{ width: '24px', height: '24px', color: '#e11d48' }} />
              ) : (
                <HeartOutline style={{ width: '24px', height: '24px', color: 'white' }} />
              )}
            </span>
          </button>
          
          {/* Thumbs up button */}
          <button 
            onClick={() => handleThumbsRating(true)}
            className={`action-button ${meal.isThumbsUp === true ? 'thumbs-up-active' : ''}`}
            title="Would Order Again"
          >
            <span className={`thumbs-up-icon ${meal.isThumbsUp === true ? 'filled' : ''}`}>
              {meal.isThumbsUp === true ? (
                <HandThumbUpSolid style={{ width: '24px', height: '24px', color: 'white' }} />
              ) : (
                <HandThumbUpIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              )}
            </span>
          </button>
          
          {/* Thumbs down button */}
          <button 
            onClick={() => handleThumbsRating(false)}
            className={`action-button ${meal.isThumbsUp === false ? 'thumbs-down-active' : ''}`}
            title="Would Not Order Again"
          >
            <span className={`thumbs-down-icon ${meal.isThumbsUp === false ? 'filled' : ''}`}>
              {meal.isThumbsUp === false ? (
                <HandThumbDownSolid style={{ width: '24px', height: '24px', color: 'white' }} />
              ) : (
                <HandThumbDownIcon style={{ width: '24px', height: '24px', color: 'white' }} />
              )}
            </span>
          </button>
        </div>

        {/* Meal images section with MultiImageUploader */}
        <div className="my-6">
          <h3 className="text-lg font-medium mb-2">Photos</h3>
          
          {/* Display primary image prominently if available */}
          {meal.mealImages && meal.mealImages.length > 0 && meal.mealImages.find(img => img.isPrimary) && (
            <div className="mb-4">
              <img 
                src={meal.mealImages.find(img => img.isPrimary).url} 
                alt={meal.name} 
                className="w-full max-h-96 object-cover rounded-lg shadow-md"
              />
              {meal.mealImages.find(img => img.isPrimary).caption && (
                <p className="text-sm text-gray-600 mt-1">
                  {meal.mealImages.find(img => img.isPrimary).caption}
                </p>
              )}
            </div>
          )}
          
          {/* MultiImageUploader for managing images */}
          <MultiImageUploader 
            images={meal.mealImages || []} 
            onImagesUpdated={handleImagesUpdated}
            entityType="meal"
          />
        </div>

        {/* Notes */}
        {meal.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{meal.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
