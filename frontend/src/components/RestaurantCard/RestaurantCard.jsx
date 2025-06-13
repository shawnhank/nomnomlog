import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

export default function RestaurantCard({ restaurant, onToggleFavorite }) {
  // Find primary image if available
  // If there's only one image, treat it as primary regardless of isPrimary flag
  const primaryImage = restaurant.restaurantImages && restaurant.restaurantImages.length > 0 
    ? (restaurant.restaurantImages.length === 1
      ? restaurant.restaurantImages[0]
      : restaurant.restaurantImages.find(img => img.isPrimary) || restaurant.restaurantImages[0])
    : null;

  // If no restaurantImages but there's a legacy imageUrl, use that
  const imageToShow = primaryImage ? primaryImage.url : restaurant.imageUrl;

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    onToggleFavorite(restaurant._id, e);
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <Link to={`/restaurants/${restaurant._id}`} className="block">
        {/* Image - edge to edge on mobile */}
        {imageToShow && (
          <div className="w-full aspect-[4/3]">
            <img 
              src={imageToShow} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content section */}
        <div className="px-4 py-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{restaurant.name}</h3>
              
              {restaurant.address && (
                <p className="mt-1 text-sm text-gray-700">{restaurant.address}</p>
              )}
              
              {restaurant.phone && (
                <p className="mt-1 text-sm text-gray-500">{restaurant.phone}</p>
              )}
            </div>
            
            <button 
              onClick={handleToggleFavorite}
              className="text-gray-400 hover:text-red-500 ml-2"
              title={restaurant.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {restaurant.isFavorite ? (
                <HeartSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
