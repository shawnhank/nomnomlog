import { useState } from 'react';
import { Link } from 'react-router';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import { HandThumbUpIcon, HandThumbDownIcon, XMarkIcon, MapPinIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import { Button } from '../catalyst/button';
import './RestaurantCard.css';

export default function RestaurantCard({ restaurant, onThumbsRating, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Find primary image if available
  const primaryImage = restaurant.restaurantImages && restaurant.restaurantImages.length > 0 
    ? (restaurant.restaurantImages.find(img => img.isPrimary) || restaurant.restaurantImages[0])
    : null;

  // If no restaurantImages but there's a legacy imageUrl, use that
  const imageToShow = primaryImage ? primaryImage.url : restaurant.imageUrl;
  
  const handleThumbsRating = (isThumbsUp, e) => {
    e.preventDefault(); // Prevent navigation
    
    // If the current state matches the requested state, clear it (set to null)
    const newValue = restaurant.isThumbsUp === isThumbsUp ? null : isThumbsUp;
    onThumbsRating(restaurant._id, newValue, e);
  };
  
  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = () => {
    if (onDelete) {
      try {
        onDelete(restaurant._id);
      } catch (err) {
        console.error('Error in delete handler:', err);
      }
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="relative overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-500 transition-colors duration-150"
            title="Delete restaurant"
          >
            <XMarkIcon className="w-4 h-4 text-red-500 hover:text-white" />
          </button>
        )}
        
        <Link to={`/restaurants/${restaurant._id}`} className="block">
          {/* Image - edge to edge on mobile */}
          {imageToShow && (
            <div className="w-full aspect-[4/3] relative">
              <img 
                src={imageToShow} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-black/80"></div>
              
              {/* Text overlay with all restaurant info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
                {/* Restaurant name */}
                <h3 className="text-base font-semibold line-clamp-2" style={{ color: 'white' }}>
                  {restaurant.name}
                </h3>
                
                {/* Restaurant details in overlay */}
                <div className="mt-2 space-y-1.5">
                  {/* Address with map links */}
                  {restaurant.address && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-white mr-1.5 flex-shrink-0" />
                      <div className="flex flex-wrap items-center">
                        <span className="text-white text-sm mr-2">{restaurant.address}</span>
                        <div className="flex gap-2 text-sm">
                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200"
                            onClick={e => e.stopPropagation()}
                          >
                            Google Maps
                          </a>
                          <span className="text-gray-400">|</span>
                          <a 
                            href={`https://maps.apple.com/?q=${encodeURIComponent(restaurant.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200"
                            onClick={e => e.stopPropagation()}
                          >
                            Apple Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Contact info row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {/* Phone */}
                    {restaurant.phone && (
                      <a
                        href={`tel:${restaurant.phone}`}
                        className="text-blue-300 hover:text-blue-200 text-sm flex items-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <PhoneIcon className="h-4 w-4 mr-1.5" />
                        {restaurant.phone}
                      </a>
                    )}
                    
                    {/* Website */}
                    {restaurant.website && (
                      <a
                        href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 text-sm flex items-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <GlobeAltIcon className="h-4 w-4 mr-1.5" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content section - only shown if no image */}
          {!imageToShow && (
            <div className="px-4 py-3 sm:p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{restaurant.name}</h3>
                  
                  {restaurant.address && (
                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Rating buttons */}
          <div className="px-4 py-3 flex justify-end space-x-2">
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
        </Link>
      </div>
      
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Restaurant"
        message="Are you sure you want to delete this restaurant? This action cannot be undone."
        itemName={restaurant.name}
      />
    </>
  );
}
