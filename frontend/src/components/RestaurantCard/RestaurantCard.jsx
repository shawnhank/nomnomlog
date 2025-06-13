import { Link } from 'react-router';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';

export default function RestaurantCard({ restaurant, onThumbsRating }) {
  // Find primary image if available
  // If there's only one image, treat it as primary regardless of isPrimary flag
  const primaryImage = restaurant.restaurantImages && restaurant.restaurantImages.length > 0 
    ? (restaurant.restaurantImages.length === 1
      ? restaurant.restaurantImages[0]
      : restaurant.restaurantImages.find(img => img.isPrimary) || restaurant.restaurantImages[0])
    : null;

  // If no restaurantImages but there's a legacy imageUrl, use that
  const imageToShow = primaryImage ? primaryImage.url : restaurant.imageUrl;
  
  const handleThumbsRating = (isThumbsUp, e) => {
    e.preventDefault(); // Prevent navigation
    
    // If the current state matches the requested state, clear it (set to null)
    const newValue = restaurant.isThumbsUp === isThumbsUp ? null : isThumbsUp;
    onThumbsRating(restaurant._id, newValue, e);
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
            
            <div className="flex space-x-2">
              <button 
                onClick={(e) => handleThumbsRating(true, e)}
                className="text-gray-400 hover:text-green-500"
                title="Would visit again"
              >
                {restaurant.isThumbsUp === true ? (
                  <HandThumbUpSolid className="w-5 h-5 text-green-500" />
                ) : (
                  <HandThumbUpIcon className="w-5 h-5" />
                )}
              </button>
              
              <button 
                onClick={(e) => handleThumbsRating(false, e)}
                className="text-gray-400 hover:text-red-500"
                title="Would not visit again"
              >
                {restaurant.isThumbsUp === false ? (
                  <HandThumbDownSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HandThumbDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
