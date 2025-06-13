import React, { useState } from 'react';
import { Link } from 'react-router';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ThumbsRating from '../ThumbsRating/ThumbsRating';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

export default function MealCard({ meal, onThumbsRating, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Find primary image if available
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? (meal.mealImages.find(img => img.isPrimary) || meal.mealImages[0])
    : null;

  // Format date
  const formattedDate = new Date(meal.date).toLocaleDateString();
  
  // Handle thumbs rating if provided
  const handleThumbsRating = onThumbsRating 
    ? (newValue, e) => {
        // Prevent event from bubbling up to parent link
        e.preventDefault();
        e.stopPropagation();
        onThumbsRating(meal._id, newValue, e);
      }
    : null;
    
  // Handle delete click
  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteModal(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (onDelete) {
      try {
        onDelete(meal._id);
      } catch (err) {
        console.error('Error in delete handler:', err);
      }
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden rounded-lg border border-gray-200">
        {/* Delete button - only shown if onDelete is provided */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-500 transition-colors duration-150"
            title="Delete meal"
          >
            <XMarkIcon className="w-4 h-4 text-red-500 hover:text-white" />
          </button>
        )}
        
        {/* Image */}
        {primaryImage ? (
          <div className="relative h-56 bg-gray-200">
            <Link to={`/meals/${meal._id}`} className="block h-full">
              <img 
                src={primaryImage.url} 
                alt={meal.name} 
                className="w-full h-full object-cover"
              />
            </Link>
            
            {/* Semi-transparent background bar for text */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
              <Link to={`/meals/${meal._id}`} className="block">
                <h3 className="text-white font-bold text-lg leading-tight">{meal.name}</h3>
              </Link>
              {meal.restaurantId && (
                <Link 
                  to={`/restaurants/${meal.restaurantId._id}`}
                  className="text-white hover:text-blue-300 font-medium text-sm inline-block"
                >
                  {meal.restaurantId.name}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 border-b">
            <Link to={`/meals/${meal._id}`}>
              <h3 className="font-semibold text-lg">{meal.name}</h3>
            </Link>
            {meal.restaurantId && (
              <Link 
                to={`/restaurants/${meal.restaurantId._id}`}
                className="text-blue-600 hover:text-blue-800 text-sm inline-block"
              >
                {meal.restaurantId.name}
              </Link>
            )}
          </div>
        )}
        
        {/* Card footer with date and thumbs */}
        <div className="p-3 flex justify-between items-center mt-auto">
          <Link to={`/meals/${meal._id}`} className="text-gray-600 text-sm">
            {formattedDate}
          </Link>
          
          {handleThumbsRating && (
            <ThumbsRating 
              value={meal.isThumbsUp}
              onChange={handleThumbsRating}
              size="md" // Changed from "sm" to "md" for larger icons
            />
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Meal"
        message="Are you sure you want to delete this meal? This action cannot be undone."
        itemName={meal?.name}
      />
    </>
  );
}
