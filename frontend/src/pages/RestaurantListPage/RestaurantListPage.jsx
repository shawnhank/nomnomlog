import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { PlusIcon as PlusSolid } from '@heroicons/react/24/solid';
import * as restaurantService from '../../services/restaurant';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';

export default function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch restaurants when component mounts or when showFavoritesOnly changes
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        let restaurantsData;
        
        if (showFavoritesOnly) {
          restaurantsData = await restaurantService.getFavorites();
        } else {
          restaurantsData = await restaurantService.getAll();
        }
        
        setRestaurants(restaurantsData);
      } catch (err) {
        setError('Failed to load restaurants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, [showFavoritesOnly]);

  // Handle toggling favorite status
  async function handleToggleFavorite(id, e) {
    // Prevent the click from navigating to the detail page
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const updatedRestaurant = await restaurantService.toggleFavorite(id);
      
      // Update the restaurants state with the updated restaurant
      setRestaurants(restaurants.map(restaurant => 
        restaurant._id === updatedRestaurant._id ? updatedRestaurant : restaurant
      ));
    } catch (err) {
      setError('Failed to update favorite status');
    }
  }

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full md:max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
      </div>
      
      <div className="flex overflow-x-auto pb-2 mb-4 border-b border-gray-200">
        <button 
          className={`px-3 py-2 flex items-center whitespace-nowrap mr-2 ${!showFavoritesOnly ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'}`}
          onClick={() => setShowFavoritesOnly(false)}
        >
          <span>All</span>
        </button>
        <button 
          className={`px-3 py-2 flex items-center whitespace-nowrap mr-2 ${showFavoritesOnly ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'}`}
          onClick={() => setShowFavoritesOnly(true)}
        >
          <HeartSolid className="w-5 h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Favorites</span>
        </button>
        <Link to="/restaurants/new" className="ml-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          <PlusSolid className="w-6 h-6" />
          <span className="hidden sm:inline ml-1">Add</span>
        </Link>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      {/* Show error message if fetch failed */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading restaurants...</div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'No restaurants match your search.' 
            : showFavoritesOnly 
              ? 'No favorite restaurants yet. Mark some as favorites!' 
              : 'No restaurants yet. Add your first one!'}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:gap-6">
          {filteredRestaurants.map(restaurant => (
            <li key={restaurant._id}>
              <RestaurantCard 
                restaurant={restaurant} 
                onToggleFavorite={handleToggleFavorite} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
