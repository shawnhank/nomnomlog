import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import './RestaurantCard.css';

export default function RestaurantCard({ restaurant, onToggleFavorite }) {
  // Find primary image if available
  const primaryImage = restaurant.restaurantImages && restaurant.restaurantImages.length > 0 
    ? restaurant.restaurantImages.find(img => img.isPrimary) || restaurant.restaurantImages[0]
    : null;

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    onToggleFavorite(restaurant._id);
  };

  return (
    <div className="restaurant-card border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/restaurants/${restaurant._id}`} className="block">
        {/* Restaurant header with name and favorite icon */}
        <div className="p-4">
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
              onClick={handleToggleFavorite}
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
        </div>
        
        {/* Restaurant image */}
        {primaryImage && (
          <div className="w-full">
            <img 
              src={primaryImage.url} 
              alt={restaurant.name} 
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </Link>
    </div>
  );
}