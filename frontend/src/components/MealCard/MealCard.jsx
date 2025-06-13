import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';

export default function MealCard({ meal, onToggleFavorite }) {
  // Find primary image if available
  // If there's only one image, treat it as primary regardless of isPrimary flag
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? (meal.mealImages.length === 1 
        ? meal.mealImages[0] 
        : meal.mealImages.find(img => img.isPrimary) || meal.mealImages[0])
    : null;
  
  // If no mealImages but there's a legacy imageUrl, use that
  const imageToShow = primaryImage ? primaryImage.url : meal.imageUrl;

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    onToggleFavorite(meal._id);
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <Link to={`/meals/${meal._id}`} className="block">
        {/* Image - edge to edge on mobile */}
        {imageToShow && (
          <div className="w-full aspect-[4/3]">
            <img 
              src={imageToShow} 
              alt={meal.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content section */}
        <div className="px-4 py-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{meal.name}</h3>
              
              {meal.restaurantId && (
                <p className="mt-1 text-sm text-gray-700">
                  at {meal.restaurantId.name}
                </p>
              )}
              
              <p className="mt-1 text-sm text-gray-500">
                {new Date(meal.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-2">
              {meal.isFavorite && (
                <HeartSolid className="w-5 h-5 text-red-500" />
              )}
              {meal.isThumbsUp === true && (
                <HandThumbUpSolid className="w-5 h-5 text-green-500" />
              )}
              {meal.isThumbsUp === false && (
                <HandThumbDownSolid className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
