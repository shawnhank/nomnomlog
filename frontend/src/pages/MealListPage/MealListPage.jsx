import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid, PlusIcon as PlusSolid } from '@heroicons/react/24/solid';
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
  // State to track which filter view is active
  const [activeFilter, setActiveFilter] = useState('all');
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch meals when component mounts or when activeFilter changes
  useEffect(() => {
    async function fetchMeals() {
      try {
        setLoading(true);
        let mealsData;
        
        switch(activeFilter) {
          case 'favorites':
            mealsData = await mealService.getFavorites();
            break;
          case 'thumbsUp':
            mealsData = await mealService.getThumbsUp();
            break;
          case 'thumbsDown':
            mealsData = await mealService.getThumbsDown();
            break;
          default:
            mealsData = await mealService.getAll();
        }
        
        setMeals(mealsData);
      } catch (err) {
        setError('Failed to load meals');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, [activeFilter]);

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
    <div className="max-w-full md:max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Meals</h1>
      </div>
      
      <div className="flex overflow-x-auto pb-2 mb-4 border-b border-gray-200">
        <button 
          className={`px-3 py-2 flex items-center whitespace-nowrap mr-2 ${activeFilter === 'all' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'}`}
          onClick={() => setActiveFilter('all')}
        >
          <span>All Meals</span>
        </button>
        <button 
          className={`px-3 py-2 flex items-center whitespace-nowrap mr-2 ${activeFilter === 'favorites' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'}`}
          onClick={() => setActiveFilter('favorites')}
        >
          <HeartSolid className="w-5 h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Favorites</span>
        </button>
        <button 
          className={`px-3 py-2 flex items-center whitespace-nowrap mr-2 ${activeFilter === 'thumbsUp' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'}`}
          onClick={() => setActiveFilter('thumbsUp')}
        >
          <HandThumbUpSolid className="w-5 h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Would Order Again</span>
        </button>
        <button 
          className={`px-3 py-2 flex items-center whitespace-nowrap mr-2 ${activeFilter === 'thumbsDown' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'}`}
          onClick={() => setActiveFilter('thumbsDown')}
        >
          <HandThumbDownSolid className="w-5 h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Would Not Order Again</span>
        </button>
        <Link to="/meals/new" className="ml-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          <PlusSolid className="w-6 h-6" />
          <span className="hidden sm:inline ml-1">Add</span>
        </Link>
      </div>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      {/* Error message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {/* Content */}
      {loading ? (
        <div className="text-center py-8">Loading meals...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'No meals match your search.' 
            : activeFilter === 'favorites'
              ? 'No favorite meals yet. Mark some as favorites!'
              : activeFilter === 'thumbsUp'
                ? 'No "would order again" meals yet. Give some meals a thumbs up!'
                : activeFilter === 'thumbsDown'
                  ? 'No "would not order again" meals yet. Give some meals a thumbs down!'
                  : 'No meals added yet. Add your first meal!'}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:gap-6">
          {filteredMeals.map(meal => (
            <li key={meal._id}>
              <MealCard
                meal={meal}
                onToggleFavorite={handleToggleFavorite}
                onThumbsRating={handleThumbsRating}  
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
