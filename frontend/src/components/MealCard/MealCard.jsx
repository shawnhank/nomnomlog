import React, { useState } from 'react';
import { Link } from 'react-router';
import { XMarkIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import ThumbsRating from '../ThumbsRating/ThumbsRating';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

export default function MealCard({ meal, onThumbsRating }) {
  // Find primary image if available
  // If there's only one image, treat it as primary regardless of isPrimary flag
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? (meal.mealImages.length === 1
      ? meal.mealImages[0]
      : meal.mealImages.find(img => img.isPrimary) || meal.mealImages[0])
    : null;

  // If no mealImages but there's a legacy imageUrl, use that
  const imageToShow = primaryImage ? primaryImage.url : meal.imageUrl;
  
  // Format the date
  const formattedDate = meal.date ? new Date(meal.date).toLocaleDateString() : '';
  
  const handleThumbsRating = (isThumbsUp, e) => {
    e.preventDefault(); // Prevent navigation
    
    // If the current state matches the requested state, clear it (set to null)
    const newValue = meal.isThumbsUp === isThumbsUp ? null : isThumbsUp;
    onThumbsRating(meal._id, newValue, e);
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <Link to={`/meals/${meal._id}`} className="block">
        {/* Image */}
        {primaryImage ? (
          <div className="relative h-56 bg-gray-200">
            {/* Remove the nested Link and use a div instead */}
            <div className="h-full">
              <img 
                src={primaryImage.url} 
                alt={meal.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Semi-transparent background bar for text */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
              <div className="flex flex-col">
                {/* Remove Link here and just use text */}
                <h3 className="text-white font-bold text-lg leading-tight">{meal.name}</h3>
                
                {meal.restaurantId && (
                  <Link 
                    to={`/restaurants/${meal.restaurantId._id}`}
                    className="text-white hover:text-blue-300 font-medium text-sm inline-block"
                    onClick={(e) => e.stopPropagation()} // Prevent parent link navigation
                  >
                    {meal.restaurantId.name}
                  </Link>
                )}
                
                {/* Date and thumbs in same row */}
                <div className="flex justify-between items-center mt-2">
                  {/* Remove Link here and just use text */}
                  <span className="text-white text-sm">
                    {formattedDate}
                  </span>
                  
                  {handleThumbsRating && (
                    <div className="flex space-x-2 ml-auto">
                      <button 
                        onClick={(e) => handleThumbsRating(true, e)}
                        className="text-white hover:text-green-500"
                        title="Would order again"
                      >
                        {meal.isThumbsUp === true ? (
                          <HandThumbUpSolid className="w-5 h-5 text-green-500" />
                        ) : (
                          <HandThumbUpIcon className="w-5 h-5" />
                        )}
                      </button>
                      
                      <button 
                        onClick={(e) => handleThumbsRating(false, e)}
                        className="text-white hover:text-red-500"
                        title="Would not order again"
                      >
                        {meal.isThumbsUp === false ? (
                          <HandThumbDownSolid className="w-5 h-5 text-red-500" />
                        ) : (
                          <HandThumbDownIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b">
            {/* Remove Link here and just use text */}
            <h3 className="font-semibold text-lg">{meal.name}</h3>
            
            {meal.restaurantId && (
              <Link 
                to={`/restaurants/${meal.restaurantId._id}`}
                className="text-blue-600 hover:text-blue-800 text-sm inline-block"
                onClick={(e) => e.stopPropagation()} // Prevent parent link navigation
              >
                {meal.restaurantId.name}
              </Link>
            )}
            
            {/* Date and thumbs for no-image case */}
            <div className="flex justify-between items-center mt-2">
              {/* Remove Link here and just use text */}
              <span className="text-gray-600 text-sm">
                {formattedDate}
              </span>
              
              {handleThumbsRating && (
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => handleThumbsRating(true, e)}
                    className="text-gray-400 hover:text-green-500"
                    title="Would order again"
                  >
                    {meal.isThumbsUp === true ? (
                      <HandThumbUpSolid className="w-5 h-5 text-green-500" />
                    ) : (
                      <HandThumbUpIcon className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button 
                    onClick={(e) => handleThumbsRating(false, e)}
                    className="text-gray-400 hover:text-red-500"
                    title="Would not order again"
                  >
                    {meal.isThumbsUp === false ? (
                      <HandThumbDownSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HandThumbDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remove the original card footer since we moved everything into the overlay */}
      </Link>
    </div>
  );
}
