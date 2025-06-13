import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbDownIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as restaurantService from '../../services/restaurant';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';

export default function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'thumbsUp', 'thumbsDown', 'unrated'

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        let fetchedRestaurants;
        
        switch (activeFilter) {
          case 'thumbsUp':
            fetchedRestaurants = await restaurantService.getThumbsUp();
            break;
          case 'thumbsDown':
            fetchedRestaurants = await restaurantService.getThumbsDown();
            break;
          case 'unrated':
            fetchedRestaurants = await restaurantService.getUnrated();
            break;
          default:
            fetchedRestaurants = await restaurantService.getAll();
        }
        
        setRestaurants(fetchedRestaurants);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurants');
        setLoading(false);
      }
    }
    
    fetchRestaurants();
  }, [activeFilter]);
  
  // Handle setting thumbs rating
  async function handleThumbsRating(id, isThumbsUp, e) {
    // Prevent the click from navigating to the detail page
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const updatedRestaurant = await restaurantService.setThumbsRating(id, isThumbsUp);
      
      // Update the restaurants state with the updated restaurant
      setRestaurants(restaurants.map(restaurant => 
        restaurant._id === updatedRestaurant._id ? updatedRestaurant : restaurant
      ));
    } catch (err) {
      console.error('Error updating thumbs rating:', err);
      setError(`Failed to update thumbs rating: ${err.message || 'Unknown error'}`);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  }

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-center mb-6">Restaurants</h1>
      </div>
      
      {/* Filter tabs */}
      <div className="tabs">
        <button 
          className={activeFilter === 'all' ? 'active' : ''} 
          onClick={() => setActiveFilter('all')}
        >
          All Restaurants
        </button>
        <button 
          className={activeFilter === 'thumbsUp' ? 'active' : ''} 
          onClick={() => setActiveFilter('thumbsUp')}
        >
          <HandThumbUpIcon className="w-4 h-4 inline mr-1" />
          <span>Would Visit Again</span>
        </button>
        <button 
          className={activeFilter === 'thumbsDown' ? 'active' : ''} 
          onClick={() => setActiveFilter('thumbsDown')}
        >
          <HandThumbDownIcon className="w-4 h-4 inline mr-1" />
          <span>Would Not Visit Again</span>
        </button>
        <button 
          className={activeFilter === 'unrated' ? 'active' : ''} 
          onClick={() => setActiveFilter('unrated')}
        >
          <span>Unrated</span>
        </button>
        <Link 
          to="/restaurants/new" 
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
          placeholder="Search restaurants..."
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
        <div className="text-center py-8">Loading restaurants...</div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'No restaurants match your search.' 
            : activeFilter === 'thumbsUp'
              ? 'No "would visit again" restaurants yet. Give some restaurants a thumbs up!'
              : activeFilter === 'thumbsDown'
                ? 'No "would not visit again" restaurants yet. Give some restaurants a thumbs down!'
                : activeFilter === 'unrated'
                  ? 'No unrated restaurants. All your restaurants have been rated!'
                  : 'No restaurants added yet. Add your first restaurant!'}
        </div>
      ) : (
        <ul className="restaurant-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredRestaurants.map(restaurant => (
            <li key={restaurant._id} className="restaurant-item">
              <RestaurantCard 
                restaurant={restaurant} 
                onThumbsRating={handleThumbsRating} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
