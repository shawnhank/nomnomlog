import { Link } from 'react-router';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import './MealCard.css';

export default function MealCard({ meal }) {
  // Find primary image if available
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? meal.mealImages.find(img => img.isPrimary) 
    : null;

  return (
    <div className="meal-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/meals/${meal._id}`} className="block p-4">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-medium">{meal.name}</h4>
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
        
        {meal.restaurantId && (
          <p className="text-sm text-gray-700">
            at {meal.restaurantId.name}
          </p>
        )}
        
        <p className="text-sm text-gray-600 mt-1">
          {new Date(meal.date).toLocaleDateString()}
        </p>
        
        {/* Show meal image if available */}
        {primaryImage && (
          <div className="mt-2">
            <img 
              src={primaryImage.url} 
              alt={meal.name} 
              className="w-full h-32 object-cover rounded"
            />
          </div>
        )}
      </Link>
    </div>
  );
}