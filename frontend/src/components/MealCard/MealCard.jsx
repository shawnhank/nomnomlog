import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { XMarkIcon, HandThumbUpIcon, HandThumbDownIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import ThumbsRating from '../ThumbsRating/ThumbsRating';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

export default function MealCard({ meal, onThumbsRating, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
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

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setShowMenu(false);
    setShowDeleteModal(true);
  };
  
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

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleClickOutside = () => {
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <div className="relative overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        {/* Add ellipsis menu */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={toggleMenu}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-150"
            title="Options"
          >
            <EllipsisVerticalIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-20 overflow-hidden">
              <Link 
                to={`/meals/${meal._id}/edit`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <PencilSquareIcon className="w-4 h-4 mr-2" />
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
        
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
        </Link>
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
