import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import * as restaurantService from '../../services/restaurant';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import './RestaurantDetailPage.css';

export default function RestaurantDetailPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch restaurant details when component mounts
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const restaurantData = await restaurantService.getById(id);
        setRestaurant(restaurantData);
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurant();
  }, [id]);

  // Handle delete restaurant
  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantService.deleteRestaurant(id);
        navigate('/restaurants');
      } catch (err) {
        setError('Failed to delete restaurant');
      }
    }
  }

  // Handle toggle favorite
  async function handleToggleFavorite() {
    try {
      const updatedRestaurant = await restaurantService.toggleFavorite(id);
      setRestaurant(updatedRestaurant);
    } catch (err) {
      setError('Failed to update favorite status');
    }
  }

  // Handle image updates
  async function handleImagesUpdated(updatedData) {
    try {
      const updatedRestaurant = await restaurantService.update(id, {
        ...restaurant,
        ...updatedData
      });
      setRestaurant(updatedRestaurant);
    } catch (err) {
      setError('Failed to update restaurant images');
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading restaurant details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!restaurant) return <div className="text-gray-600 p-4">Restaurant not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header with restaurant name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{restaurant.name}</h1>
        <div className="flex gap-3">
          <Link 
            to="/restaurants/new"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Add Restaurant
          </Link>
          <button 
            onClick={() => navigate(`/restaurants/${id}/edit`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            className="bg-white hover:bg-red-50 text-red-600 border border-red-600 px-4 py-2 rounded-md text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Restaurant details */}
      <div className="space-y-6">
        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurant.address && (
            <div>
              <p className="text-gray-600 font-medium mb-1">Address</p>
              <p>{restaurant.address}</p>
            </div>
          )}
          {restaurant.phone && (
            <div>
              <p className="text-gray-600 font-medium mb-1">Phone</p>
              <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                {restaurant.phone}
              </a>
            </div>
          )}
          {restaurant.website && (
            <div>
              <p className="text-gray-600 font-medium mb-1">Website</p>
              <a 
                href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {restaurant.website}
              </a>
            </div>
          )}
        </div>

        {/* Favorite button */}
        <div className="action-buttons-container">
          <button 
            onClick={handleToggleFavorite}
            className="action-button"
            title={restaurant.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span className={`heart-icon ${restaurant.isFavorite ? 'filled' : ''}`}>
              {restaurant.isFavorite ? (
                <HeartSolid style={{ width: '24px', height: '24px', color: '#e11d48' }} />
              ) : (
                <HeartOutline style={{ width: '24px', height: '24px', color: 'white' }} />
              )}
            </span>
          </button>
        </div>

        {/* Restaurant images section with MultiImageUploader */}
        <div className="my-6">
          <h3 className="text-lg font-medium mb-2">Photos</h3>
          
          {/* Display primary image prominently if available */}
          {restaurant.restaurantImages && restaurant.restaurantImages.length > 0 && restaurant.restaurantImages.find(img => img.isPrimary) && (
            <div className="mb-4">
              <img 
                src={restaurant.restaurantImages.find(img => img.isPrimary).url} 
                alt={restaurant.name} 
                className="w-full max-h-96 object-cover rounded-lg shadow-md"
              />
              {restaurant.restaurantImages.find(img => img.isPrimary).caption && (
                <p className="text-sm text-gray-600 mt-1">
                  {restaurant.restaurantImages.find(img => img.isPrimary).caption}
                </p>
              )}
            </div>
          )}
          
          {/* MultiImageUploader for managing images */}
          <MultiImageUploader 
            images={restaurant.restaurantImages || []} 
            onImagesUpdated={handleImagesUpdated}
            entityType="restaurant"
          />
        </div>

        {/* Link to meals at this restaurant */}
        <div className="mt-8 pt-4 border-t">
          <Link 
            to={`/meals?restaurant=${restaurant._id}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            View Meals at {restaurant.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
