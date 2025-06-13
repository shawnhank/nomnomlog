import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Button } from '../../components/catalyst/button';
import { HandThumbUpIcon, HandThumbDownIcon, PlusIcon, MapPinIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as restaurantService from '../../services/restaurant';
import * as mealService from '../../services/meal';
import MealCard from '../../components/MealCard/MealCard';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import ThumbsRating from '../../components/ThumbsRating/ThumbsRating';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
import YelpIntegration from '../../components/YelpIntegration/YelpIntegration';

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
    setShowDeleteModal(false);
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

  // Add these handler functions
  async function handleMealThumbsRating(mealId, isThumbsUp, e) {
    try {
      const updatedMeal = await mealService.setThumbsRating(mealId, isThumbsUp);
      // Update the meals state with the updated meal
      setMeals(meals.map(meal => 
        meal._id === updatedMeal._id ? updatedMeal : meal
      ));
    } catch (err) {
      setError('Failed to update meal thumbs rating');
      console.error(err);
    }
  }

  // Add delete meal handler function
  async function handleDeleteMeal(mealId) {
    try {
      await mealService.deleteMeal(mealId);
      // Remove the deleted meal from the state
      setMeals(meals.filter(meal => meal._id !== mealId));
    } catch (err) {
      setError('Failed to delete meal');
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs 
          customCrumbs={[
            { name: 'Restaurants', path: '/restaurants', current: false },
            { name: restaurant.name, path: `/restaurants/${restaurant._id}`, current: true }
          ]}
        />
      </div>
      
      {/* Header with restaurant name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{restaurant.name}</h1>
          <ThumbsRating 
            value={restaurant.isThumbsUp} 
            onChange={handleThumbsRating}
            size="lg"
          />
        </div>
        <div className="flex space-x-2 items-center">
          <Link to="/restaurants/new">
            <Button positive className="flex items-center">
              <PlusIcon className="w-5 h-5 mr-1" />
              <span>Add Restaurant</span>
            </Button>
          </Link>
          <Link to={`/restaurants/${restaurant._id}/edit`}>
            <Button positive>Edit</Button>
          </Link>
          <Button
            negative
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Restaurant details with overlay styling */}
      {primaryImage && (
        <div className="relative overflow-hidden rounded-lg mb-6">
          <img 
            src={primaryImage.url} 
            alt={restaurant.name} 
            className="w-full h-80 object-cover"
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-black/80"></div>
          
          {/* Text overlay with restaurant info */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
            {/* Restaurant details in overlay */}
            <div className="space-y-3">
              {/* Address with map links */}
              {restaurant.address && (
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-white">{restaurant.address}</span>
                    <div className="flex gap-2 mt-2">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200"
                      >
                        Google Maps
                      </a>
                      <span className="text-gray-400">|</span>
                      <a 
                        href={`https://maps.apple.com/?q=${encodeURIComponent(restaurant.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200"
                      >
                        Apple Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact info row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                {/* Phone */}
                {restaurant.phone && (
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="text-blue-300 hover:text-blue-200 flex items-center"
                  >
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    {restaurant.phone}
                  </a>
                )}
                
                {/* Website */}
                {restaurant.website && (
                  <a
                    href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 flex items-center"
                  >
                    <GlobeAltIcon className="h-5 w-5 mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback for no image */}
      {!primaryImage && (
        <div className="mb-6 space-y-4">
          {/* Address */}
          {restaurant.address && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Address</h3>
              <p className="text-gray-700">{restaurant.address}</p>
              <div className="mt-1 space-x-2">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-lg"
                >
                  Google Maps
                </a>
                <span className="text-gray-400">|</span>
                <a 
                  href={`https://maps.apple.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-lg"
                >
                  Apple Maps
                </a>
              </div>
            </div>
          )}
          
          {/* Phone */}
          {restaurant.phone && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Phone</h3>
              <a 
                href={`tel:${restaurant.phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {restaurant.phone}
              </a>
            </div>
          )}
          
          {/* Website */}
          {restaurant.website && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Website</h3>
              <a 
                href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-words"
              >
                {restaurant.website}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Recent meals section */}
      <div className="border-t pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Recent Meals</h2>
          <div className="flex gap-3">
            <Link to={`/meals/new?restaurantId=${restaurant._id}`}>
              <Button positive className="flex items-center">
                <PlusIcon className="w-5 h-5 mr-1" />
                <span>Add Meal</span>
              </Button>
            </Link>
            {meals.length > 0 && (
              <Link to={`/meals?restaurant=${restaurant._id}`}>
                <Button positive>
                  View All
                </Button>
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
              <li key={meal._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <MealCard 
                  meal={meal}
                  onThumbsRating={handleMealThumbsRating}
                  onDelete={handleDeleteMeal}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Restaurant images gallery section */}
      {restaurant.restaurantImages && restaurant.restaurantImages.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Restaurant Photos</h2>
            <Link to={`/restaurants/${id}/edit`}>
              <Button positive>
                Manage Photos
              </Button>
            </Link>
          </div>
          
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
        </div>
      )}

      {/* Yelp integration */}
      {restaurant.yelpId && (
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-2">Yelp Information</h2>
          <YelpIntegration yelpId={restaurant.yelpId} />
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Restaurant"
        message="Are you sure you want to delete this restaurant? This action cannot be undone."
        itemName={restaurant?.name}
      />
    </div>
  );
}
