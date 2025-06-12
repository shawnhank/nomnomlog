import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import './MealCard.css';

export default function MealCard({ meal }) {
  // Find primary image if available
  // If there's only one image, treat it as primary regardless of isPrimary flag
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? (meal.mealImages.length === 1 
        ? meal.mealImages[0] 
        : meal.mealImages.find(img => img.isPrimary) || meal.mealImages[0])
    : null;
  
  // If no mealImages but there's a legacy imageUrl, use that
  const imageToShow = primaryImage ? primaryImage.url : meal.imageUrl;

  return (
    <div className="meal-card border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/meals/${meal._id}`} className="block">
        {/* Meal header with name and icons */}
        <div className="p-4 min-h-[90px]">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-semibold line-clamp-2">{meal.name}</h4>
              
              {meal.restaurantId && (
                <p className="text-xs text-gray-700 mt-1">
                  at {meal.restaurantId.name}
                </p>
              )}
              
              <p className="text-xs text-gray-600 mt-1">
                {new Date(meal.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-2">
              {meal.isFavorite && (
                <HeartSolid className="w-4 h-4 text-red-500" />
              )}
              {meal.isThumbsUp === true && (
                <HandThumbUpSolid className="w-4 h-4 text-green-500" />
              )}
              {meal.isThumbsUp === false && (
                <HandThumbDownSolid className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
        
        {/* Meal image - supporting both mealImages and legacy imageUrl */}
        {imageToShow && (
          <div className="w-full">
            <img 
              src={imageToShow} 
              alt={meal.name} 
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </Link>
    </div>
  );
}
