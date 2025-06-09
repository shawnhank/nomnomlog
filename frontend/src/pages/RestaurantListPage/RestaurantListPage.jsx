import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import './RestaurantListPage.css';

export default function RestaurantListPage() {
  // State to store the list of restaurants
  const [restaurants, setRestaurants] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState('');

  // Fetch restaurants when component mounts
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        // Call the restaurant service to get all restaurants
        const restaurantsData = await restaurantService.getAll();
        // Update state with fetched restaurants
        setRestaurants(restaurantsData);
        setLoading(false);
      } catch (err) {
        // Handle any errors
        setError('Failed to load restaurants');
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return (
    <div className="RestaurantListPage">
      <h1>My Restaurants</h1>
      
      {/* Add New Restaurant button */}
      <Link to="/restaurants/new" className="btn-add">
        Add New Restaurant
      </Link>
      
      {/* Show loading message while fetching data */}
      {loading && <p>Loading restaurants...</p>}
      
      {/* Show error message if fetch failed */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Show message if no restaurants found */}
      {!loading && !error && restaurants.length === 0 && (
        <p>No restaurants added yet. Add your first restaurant!</p>
      )}
      
      {/* Display list of restaurants */}
      {restaurants.length > 0 && (
        <ul className="restaurant-list">
          {restaurants.map(restaurant => (
            <li key={restaurant._id} className="restaurant-item">
              <Link to={`/restaurants/${restaurant._id}`}>
                <h3>{restaurant.name}</h3>
                {restaurant.address && <p>{restaurant.address}</p>}
                {/* Category display removed */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
