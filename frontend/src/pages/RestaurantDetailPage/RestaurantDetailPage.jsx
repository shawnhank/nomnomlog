import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { PlusIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as restaurantService from '../../services/restaurant';
import * as mealService from '../../services/meal';
import MealCard from '../../components/MealCard/MealCard';

export default function RestaurantDetailPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch restaurant details when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const restaurantData = await restaurantService.getById(id);
        setRestaurant(restaurantData);
        
        // Fetch meals for this restaurant
        const allMeals = await mealService.getAll();
        const restaurantMeals = allMeals.filter(meal => 
          meal.restaurantId && meal.restaurantId._id === id
        );
        setMeals(restaurantMeals);
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Handle delete restaurant
  async function handleDelete() {
    try {
      await restaurantService.deleteRestaurant(id);
      navigate('/restaurants');
    } catch (err) {
      setError('Failed to delete restaurant');
    }
  }

  // Handle thumbs rating
  async function handleThumbsRating(isThumbsUp) {
    try {
      // If the current state matches the requested state, clear it (set to null)
      const newValue = restaurant.isThumbsUp === isThumbsUp ? null : isThumbsUp;
      const updatedRestaurant = await restaurantService.setThumbsRating(id, newValue);
      setRestaurant(updatedRestaurant);
    } catch (err) {
      setError('Failed to update thumbs rating');
      console.error(err);
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading restaurant details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!restaurant) return <div className="text-gray-600 p-4">Restaurant not found</div>;

  // Find primary image if available
  const primaryImage = restaurant.restaurantImages && restaurant.restaurantImages.length > 0 
    ? (restaurant.restaurantImages.find(img => img.isPrimary) || restaurant.restaurantImages[0])
    : null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header with restaurant name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{restaurant.name}</h1>
        <div className="flex gap-3">
          <Link 
            to="/restaurants/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span>Add Restaurant</span>
          </Link>
          <button 
            onClick={() => navigate(`/restaurants/${id}/edit`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="bg-white hover:bg-red-50 text-red-600 border border-red-600 px-4 py-2 rounded-md text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Restaurant details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left column: Info */}
        <div className="space-y-4">
          {restaurant.address && (
            <div>
              <h3 className="text-gray-600 font-medium mb-1">Address</h3>
              <p className="text-gray-800 mb-1">{restaurant.address}</p>
              <div className="flex gap-2 mt-1">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Google Maps
                </a>
                <span className="text-gray-400">|</span>
                <a 
                  href={`https://maps.apple.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Apple Maps
                </a>
              </div>
            </div>
          )}
          
          {restaurant.phone && (
            <div>
              <h3 className="text-gray-600 font-medium mb-1">Phone</h3>
              <a 
                href={`tel:${restaurant.phone}`}
                className="text-blue-600 hover:underline"
              >
                {restaurant.phone}
              </a>
            </div>
          )}
          
          {restaurant.website && (
            <div>
              <h3 className="text-gray-600 font-medium mb-1">Website</h3>
              <a 
                href={restaurant.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {restaurant.website}
              </a>
            </div>
          )}
          
          {/* Thumbs rating buttons */}
          <div className="flex gap-3 my-4">
            {/* Thumbs up button */}
            <button 
              onClick={() => handleThumbsRating(true)}
              className={`flex items-center justify-center w-10 h-10 rounded-md ${
                restaurant.isThumbsUp === true 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              title="Would Visit Again"
            >
              {restaurant.isThumbsUp === true ? (
                <HandThumbUpSolid className="w-6 h-6 text-white" />
              ) : (
                <HandThumbUpIcon className="w-6 h-6 text-white" />
              )}
            </button>
            
            {/* Thumbs down button */}
            <button 
              onClick={() => handleThumbsRating(false)}
              className={`flex items-center justify-center w-10 h-10 rounded-md ${
                restaurant.isThumbsUp === false 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              title="Would Not Visit Again"
            >
              {restaurant.isThumbsUp === false ? (
                <HandThumbDownSolid className="w-6 h-6 text-white" />
              ) : (
                <HandThumbDownIcon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* Right column: Primary Image */}
        {primaryImage && (
          <div>
            <img 
              src={primaryImage.url} 
              alt={restaurant.name} 
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            {primaryImage.caption && (
              <p className="text-sm text-gray-600 mt-1">{primaryImage.caption}</p>
            )}
          </div>
        )}
      </div>

      {/* Recent meals section */}
      <div className="border-t pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Recent Meals</h2>
          <div className="flex gap-3">
            <Link 
              to={`/meals/new?restaurantId=${restaurant._id}`}
              className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              <span>Add Meal</span>
            </Link>
            {meals.length > 0 && (
              <Link 
                to={`/meals?restaurant=${restaurant._id}`}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                <span>View All</span>
              </Link>
            )}
          </div>
        </div>
        
        {meals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No meals logged at this restaurant yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Show only up to 3 most recent meals */}
            {meals.slice(0, 3).map(meal => (
              <li key={meal._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <MealCard meal={meal} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Restaurant images gallery section */}
      {restaurant.restaurantImages && restaurant.restaurantImages.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Restaurant Photos</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {restaurant.restaurantImages.map((image, index) => (
              <div key={index} className="aspect-square">
                <img 
                  src={image.url} 
                  alt={image.caption || `${restaurant.name} photo ${index + 1}`} 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(`/restaurants/${id}/edit`)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <span>Manage Photos</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Restaurant</h3>
            <p className="mb-6">Are you sure you want to delete {restaurant.name}? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
