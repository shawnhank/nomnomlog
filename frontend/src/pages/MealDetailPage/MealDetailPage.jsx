import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';
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
      // If the current state matches what was clicked, set to null (toggle off)
      const newValue = meal.isThumbsUp === isThumbsUp ? null : isThumbsUp;
      const updatedMeal = await mealService.setThumbsRating(id, newValue);
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to update thumbs rating');
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading meal details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!meal) return <div className="text-gray-600 p-4">Meal not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header with meal name and action buttons */}
      <div className="detail-header">
        <h2>{meal.name}</h2>
        <div className="action-buttons">
          <Link to={`/meals/${id}/edit`} className="action-button">Edit</Link>
          <button 
            onClick={handleDelete} 
            className="action-button delete"
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

        {/* Meal image */}
        {meal.imageUrl && (
          <div className="my-6">
            <img 
              src={meal.imageUrl} 
              alt={meal.name} 
              className="w-full max-h-96 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

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
