import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import * as restaurantService from '../../services/restaurant';
import './RestaurantListPage.css';

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">My Restaurants</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      
      <div className="tabs mb-6">
        <button 
          className={!showFavoritesOnly ? 'active' : ''} 
          onClick={() => setShowFavoritesOnly(false)}
        >
          All Restaurants
        </button>
        <button 
          className={showFavoritesOnly ? 'active' : ''} 
          onClick={() => setShowFavoritesOnly(true)}
        >
          Show Favorites Only
        </button>
        <Link to="/restaurants/new" className="action-button">
          Add Restaurant
        </Link>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
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
        <ul className="restaurant-list">
          {filteredRestaurants.map(restaurant => (
            <li key={restaurant._id} className="restaurant-item">
              <Link to={`/restaurants/${restaurant._id}`} className="block">
                <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                      
                      {restaurant.address && (
                        <p className="text-gray-600 text-sm mt-1">{restaurant.address}</p>
                      )}
                      
                      {restaurant.phone && (
                        <p className="text-gray-600 text-sm mt-1">{restaurant.phone}</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => handleToggleFavorite(restaurant._id, e)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                      title={restaurant.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {restaurant.isFavorite ? (
                        <HeartSolid className="w-6 h-6 text-red-500" />
                      ) : (
                        <HeartOutline className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  
                  {restaurant.restaurantImages && restaurant.restaurantImages.length > 0 && restaurant.restaurantImages.find(img => img.isPrimary) && (
                    <div className="mt-3">
                      <img 
                        src={restaurant.restaurantImages.find(img => img.isPrimary).url} 
                        alt={restaurant.name} 
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
