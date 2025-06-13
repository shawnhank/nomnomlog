import React from 'react';

/**
 * A reusable card component with an image and text overlay at the bottom
 */
export default function ImageCardWithOverlay({ 
  image, 
  imageAlt, 
  title,
  subtitle,
  children,
  className = ''
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md ${className}`}>
      {/* Image */}
      {image && (
        <div className="relative w-full aspect-[4/3]">
          <img 
            src={image} 
            alt={imageAlt || title} 
            className="w-full h-full object-cover"
          />
          
          {/* Enhanced gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-black/80"></div>
          
          {/* Text overlay with improved contrast - using inline styles to guarantee white text */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
            {title && (
              <h2 
                className="text-xl leading-tight font-semibold" 
                style={{ color: 'white' }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className="text-opacity-90" 
                style={{ color: 'white' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Content below image */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
