import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as mealService from '../../services/meal';
import './MealListPage.css';

export default function MealListPage() {
  // State to store the list of meals
  const [meals, setMeals] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState('');
  // State to track if we're showing favorites only
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch meals when component mounts or when showFavoritesOnly changes
  useEffect(() => {
    async function fetchMeals() {
      try {
        setLoading(true);
        // Call the appropriate service method based on filter
        const mealsData = showFavoritesOnly 
          ? await mealService.getFavorites()
          : await mealService.getAll();
        
        setMeals(mealsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load meals');
        setLoading(false);
      }
    }

    fetchMeals();
  }, [showFavoritesOnly]);

  // Handle toggling favorite status
  async function handleToggleFavorite(id, e) {
    // Prevent the click from navigating to the detail page
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const updatedMeal = await mealService.toggleFavorite(id);
      
      // Update the meals state with the updated meal
      setMeals(meals.map(meal => 
        meal._id === updatedMeal._id ? updatedMeal : meal
      ));
    } catch (err) {
      setError('Failed to update favorite status');
    }
  }

  // Handle setting thumbs rating
  async function handleThumbsRating(id, isThumbsUp, e) {
    // Prevent the click from navigating to the detail page
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const updatedMeal = await mealService.setThumbsRating(id, isThumbsUp);
      
      // Update the meals state with the updated meal
      setMeals(meals.map(meal => 
        meal._id === updatedMeal._id ? updatedMeal : meal
      ));
    } catch (err) {
      setError('Failed to update thumbs rating');
    }
  }

  return (
    <div className="MealListPage">
      <h1>My Meals</h1>
      
      {/* Add New Meal button */}
      <Link to="/meals/new" className="btn-add">
        Add New Meal
      </Link>
      
      {/* Filter controls */}
      <div className="filter-controls">
        <button 
          className={showFavoritesOnly ? 'active' : ''}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          {showFavoritesOnly ? 'Show All Meals' : 'Show Favorites Only'}
        </button>
      </div>
      
      {/* Show loading message while fetching data */}
      {loading && <p>Loading meals...</p>}
      
      {/* Show error message if fetch failed */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Show message if no meals found */}
      {!loading && !error && meals.length === 0 && (
        <p>No meals added yet. Add your first meal!</p>
      )}
      
      {/* Display list of meals */}
      {meals.length > 0 && (
        <ul className="meal-list">
          {meals.map(meal => (
            <li key={meal._id} className="meal-item">
              <Link to={`/meals/${meal._id}`}>
                <div className="meal-header">
                  <h3>{meal.name}</h3>
                  <div className="meal-actions">
                    {/* Favorite button */}
                    <button 
                      className={`btn-favorite ${meal.isFavorite ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(meal._id, e)}
                      title={meal.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      ★
                    </button>
                    
                    {/* Thumbs up/down buttons */}
                    <div className="thumbs-container">
                      <button 
                        className={`btn-thumbs-up ${meal.isThumbsUp === true ? 'active' : ''}`}
                        onClick={(e) => handleThumbsRating(meal._id, true, e)}
                        title="Would order again"
                      >
                        👍
                      </button>
                      <button 
                        className={`btn-thumbs-down ${meal.isThumbsUp === false ? 'active' : ''}`}
                        onClick={(e) => handleThumbsRating(meal._id, false, e)}
                        title="Would not order again"
                      >
                        👎
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Restaurant name */}
                {meal.restaurantId && <p>at {meal.restaurantId.name}</p>}
                
                {/* Meal date */}
                <p className="meal-date">
                  {new Date(meal.date).toLocaleDateString()}
                </p>
                
                {/* Meal image if available */}
                {meal.imageUrl && (
                  <img 
                    src={meal.imageUrl} 
                    alt={meal.name} 
                    className="meal-image"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}