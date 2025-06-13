import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { HandThumbUpIcon, HandThumbDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';
import * as restaurantService from '../../services/restaurant';
import MealCard from '../../components/MealCard/MealCard';
import './MealListPage.css';

export default function MealListPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'thumbsUp', 'thumbsDown', 'unrated'

  useEffect(() => {
    async function fetchMeals() {
      try {
        setLoading(true);
        let mealsData;
        
        switch(activeFilter) {
          case 'thumbsUp':
            mealsData = await mealService.getThumbsUp();
            break;
          case 'thumbsDown':
            mealsData = await mealService.getThumbsDown();
            break;
          case 'unrated':
            mealsData = await mealService.getUnrated();
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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-center mb-6">Meals</h1>
      </div>
      
      {/* Filter tabs */}
      <div className="tabs">
        <button 
          className={activeFilter === 'all' ? 'active' : ''} 
          onClick={() => setActiveFilter('all')}
        >
          All Meals
        </button>
        <button 
          className={activeFilter === 'thumbsUp' ? 'active' : ''} 
          onClick={() => setActiveFilter('thumbsUp')}
        >
          <HandThumbUpIcon className="w-4 h-4 inline mr-1" />
          <span>Would Order Again</span>
        </button>
        <button 
          className={activeFilter === 'thumbsDown' ? 'active' : ''} 
          onClick={() => setActiveFilter('thumbsDown')}
        >
          <HandThumbDownIcon className="w-4 h-4 inline mr-1" />
          <span>Would Not Order Again</span>
        </button>
        <button 
          className={activeFilter === 'unrated' ? 'active' : ''} 
          onClick={() => setActiveFilter('unrated')}
        >
          <span>Unrated</span>
        </button>
        <Link 
          to="/meals/new" 
          className="ml-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-3 py-2"
        >
          <PlusIcon className="w-6 h-6" aria-hidden="true" />
          <span className="ml-1 hidden sm:inline">Add</span>
        </Link>
      </div>
      
      {/* Search bar - moved below tabs */}
      <div className="mb-4 mt-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Content */}
      {loading ? (
        <div className="text-center py-8">Loading meals...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'No meals match your search.' 
            : activeFilter === 'thumbsUp'
              ? 'No "would order again" meals yet. Give some meals a thumbs up!'
              : activeFilter === 'thumbsDown'
                ? 'No "would not order again" meals yet. Give some meals a thumbs down!'
                : activeFilter === 'unrated'
                  ? 'No unrated meals. All your meals have been rated!'
                  : 'No meals added yet. Add your first meal!'}
        </div>
      ) : (
        <ul className="meal-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredMeals.map(meal => (
            <li key={meal._id} className="meal-item">
              <MealCard 
                meal={meal} 
                onThumbsRating={handleThumbsRating} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
