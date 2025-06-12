import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';
import * as restaurantService from '../../services/restaurant';
import MealCard from '../../components/MealCard/MealCard';
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
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter meals based on search term
  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (meal.restaurantId && meal.restaurantId.name && 
     meal.restaurantId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="MealListPage">
      <div className="page-header">
        <h2>My Meals</h2>
      </div>
      
      <div className="tabs">
        <button 
          className={!showFavoritesOnly ? 'active' : ''} 
          onClick={() => setShowFavoritesOnly(false)}
        >
          All Meals
        </button>
        <button 
          className={showFavoritesOnly ? 'active' : ''} 
          onClick={() => setShowFavoritesOnly(true)}
        >
          Show Favorites Only
        </button>
        <Link to="/meals/new" className="action-button">
          Add New Meal
        </Link>
      </div>
      
      {/* Add search input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Show error message if fetch failed */}
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="text-center py-8">Loading meals...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="no-results">
          {searchTerm 
            ? 'No meals match your search.' 
            : showFavoritesOnly 
              ? 'No favorite meals yet. Mark some as favorites!' 
              : 'No meals added yet. Add your first meal!'}
        </div>
      ) : (
        <ul className="meal-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map(meal => (
            <li key={meal._id}>
              <MealCard meal={meal} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
