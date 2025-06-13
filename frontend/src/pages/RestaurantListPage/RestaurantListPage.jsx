import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { HandThumbUpIcon, HandThumbDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as restaurantService from '../../services/restaurant';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import { Button } from '../../components/catalyst/button';
import SearchBar from '../../components/SearchBar/SearchBar';
// import './RestaurantListPage.css';

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
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      </div>
      
      {/* Filter tabs - using new Button component */}
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-gray-200 pb-2 overflow-x-auto">
        <Button 
          plain={activeFilter !== 'all'}
          color={activeFilter === 'all' ? 'blue' : undefined}
          onClick={() => setActiveFilter('all')}
          className="text-sm"
        >
          <span className="whitespace-nowrap">All Restaurants</span>
        </Button>
        <Button 
          plain={activeFilter !== 'thumbsUp'}
          color={activeFilter === 'thumbsUp' ? 'blue' : undefined}
          onClick={() => setActiveFilter('thumbsUp')}
          className="text-sm"
        >
          <HandThumbUpIcon className="h-5 w-5 inline mr-1" />
          <span className="hidden sm:inline whitespace-nowrap">Would Visit Again</span>
        </Button>
        <Button 
          plain={activeFilter !== 'thumbsDown'}
          color={activeFilter === 'thumbsDown' ? 'blue' : undefined}
          onClick={() => setActiveFilter('thumbsDown')}
          className="text-sm"
        >
          <HandThumbDownIcon className="h-5 w-5 inline mr-1" />
          <span className="hidden sm:inline whitespace-nowrap">Would Not Visit Again</span>
        </Button>
        <Button 
          plain={activeFilter !== 'unrated'}
          color={activeFilter === 'unrated' ? 'blue' : undefined}
          onClick={() => setActiveFilter('unrated')}
          className="text-sm"
        >
          <span className="whitespace-nowrap">Unrated</span>
        </Button>
        <Link 
          to="/restaurants/new" 
          className="ml-auto"
        >
          <Button 
            color="blue"
            className="whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5 inline mr-1" />
            <span className="hidden sm:inline">Add Restaurant</span>
          </Button>
        </Link>
      </div>
      
      {/* Search bar */}
      <div className="mb-4 mt-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search restaurants..."
          className="w-full"
          autoFocus={false}
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredRestaurants.map(restaurant => (
            <li key={restaurant._id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
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
