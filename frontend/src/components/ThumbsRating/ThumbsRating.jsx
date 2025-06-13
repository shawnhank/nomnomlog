import React from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';

/**
 * Reusable thumbs rating component with tri-state functionality
 */
export default function ThumbsRating({ 
  value, 
  onChange,
  size = 'md',
  className = ''
}) {
  // Determine icon sizes based on the size prop
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const iconSize = iconSizes[size] || iconSizes.md;
  
  // Handle thumbs up click
  const handleThumbsUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // If already thumbs up, set to null (toggle off), otherwise set to true
    onChange(value === true ? null : true, e);
  };
  
  // Handle thumbs down click
  const handleThumbsDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // If already thumbs down, set to null (toggle off), otherwise set to false
    onChange(value === false ? null : false, e);
  };
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        type="button"
        onClick={handleThumbsUp}
        className={`p-1.5 rounded-full transition-colors duration-200 ${
          value === true 
            ? "text-blue-500" 
            : "text-gray-400 hover:text-blue-500"
        }`}
        title="Would order/visit again"
        aria-pressed={value === true}
      >
        {value === true ? (
          <HandThumbUpSolid className={iconSize} />
        ) : (
          <HandThumbUpIcon className={iconSize} />
        )}
      </button>
      
      <button
        type="button"
        onClick={handleThumbsDown}
        className={`p-1.5 rounded-full transition-colors duration-200 ${
          value === false 
            ? "text-red-500" 
            : "text-gray-400 hover:text-red-500"
        }`}
        title="Would not order/visit again"
        aria-pressed={value === false}
      >
        {value === false ? (
          <HandThumbDownSolid className={iconSize} />
        ) : (
          <HandThumbDownIcon className={iconSize} />
        )}
      </button>
    </div>
  );
}