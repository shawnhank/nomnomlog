import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { HandThumbUpIcon, HandThumbDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as mealService from '../../services/meal';
import MealCard from '../../components/MealCard/MealCard';
import { Button } from '../../components/catalyst/button';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
// import './MealListPage.css';

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

  // Handle meal deletion
  async function handleDeleteMeal(id) {
    try {
      await mealService.deleteMeal(id);
      
      // Remove the deleted meal from the state
      setMeals(meals.filter(meal => meal._id !== id));
      
      // Show success message
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Failed to delete meal: ${err.message || 'Unknown error'}`);
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
      {/* Add SimpleBreadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs 
          customCrumbs={[
            { name: 'Meals', path: '/meals', current: true }
          ]}
        />
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Meals</h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-gray-200 pb-2 overflow-x-auto">
        <Button
          plain={activeFilter !== 'all'}
          color={activeFilter === 'all' ? 'blue' : undefined}
          onClick={() => setActiveFilter('all')}
          className={`text-sm ${activeFilter === 'all' ? 'text-white' : '!text-gray-500 dark:!text-gray-300'}`}
        >
          <span className="whitespace-nowrap">All Meals</span>
        </Button>
        <Button
          plain={activeFilter !== 'thumbsUp'}
          color={activeFilter === 'thumbsUp' ? 'blue' : undefined}
          onClick={() => setActiveFilter('thumbsUp')}
          className={`text-sm ${activeFilter === 'thumbsUp' ? 'text-white' : '!text-gray-500 dark:!text-gray-300'}`}
        >
          <HandThumbUpIcon className="h-5 w-5 inline mr-1" />
          <span className="hidden sm:inline whitespace-nowrap">Thumbs Up</span>
        </Button>
        <Button
          plain={activeFilter !== 'thumbsDown'}
          color={activeFilter === 'thumbsDown' ? 'blue' : undefined}
          onClick={() => setActiveFilter('thumbsDown')}
          className={`text-sm ${activeFilter === 'thumbsDown' ? 'text-white' : '!text-gray-500 dark:!text-gray-300'}`}
        >
          <HandThumbDownIcon className="h-5 w-5 inline mr-1" />
          <span className="hidden sm:inline whitespace-nowrap">Thumbs Down</span>
        </Button>
        <Button
          plain={activeFilter !== 'unrated'}
          color={activeFilter === 'unrated' ? 'blue' : undefined}
          onClick={() => setActiveFilter('unrated')}
          className={`text-sm ${activeFilter === 'unrated' ? 'text-white' : '!text-gray-500 dark:!text-gray-300'}`}
        >
          <span className="whitespace-nowrap">No Rating</span>
        </Button>
        <Link
          to="/meals/new"
          className="ml-auto"
        >
          <Button
            outline
            color="blue"
            className="whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5 inline mr-1" />
            <span className="hidden sm:inline">Add Meal</span>
          </Button>
        </Link>
      </div>
      
      {/* Search bar */}
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
      
      {/*  Content */}
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredMeals.map(meal => (
            <li key={meal._id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <MealCard 
                meal={meal} 
                onThumbsRating={handleThumbsRating} 
                onDelete={handleDeleteMeal}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
