import { useState, useRef } from 'react';
import { Button } from '../catalyst/button';
import { Input } from '../catalyst/input';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function MultiImageUploader({
  images = [],
  onImagesUpdated,
  entityType = 'meal' // Can be 'user', 'restaurant', or 'meal'
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Get the appropriate field name based on entity type
  const getFieldName = () => {
    switch(entityType) {
      case 'user': return 'userImages';
      case 'restaurant': return 'restaurantImages';
      case 'meal': 
      default: return 'mealImages';
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      setError(null);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file via proxy:', file.name);
      
      // Upload through our proxy endpoint
      const response = await fetch('/api/uploads/proxy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', response.status, errorData);
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      
      // Create a new image object
      const newImage = {
        url: data.fileUrl,
        isPrimary: images.length === 0, // First image is primary by default
        caption: ''
      };
      
      // Update the images array
      const updatedImages = [...images, newImage];
      
      // Call the callback with the appropriate field name
      onImagesUpdated({ [getFieldName()]: updatedImages });
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    
    onImagesUpdated({ [getFieldName()]: updatedImages });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const removedImage = updatedImages.splice(index, 1)[0];
    
    // If we removed the primary image, set a new primary
    if (removedImage.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    onImagesUpdated({ [getFieldName()]: updatedImages });
  };

  const handleCaptionChange = (index, caption) => {
    const updatedImages = [...images];
    updatedImages[index].caption = caption;
    
    onImagesUpdated({ [getFieldName()]: updatedImages });
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Image gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative border-2 rounded-lg p-2 transition-colors ${
                image.isPrimary
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400'
                  : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'
              }`}
            >
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.caption || `Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  color="red"
                  plain
                  className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-gray-800/80 rounded-full"
                  aria-label="Remove image"
                >
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-2 space-y-2">
                <Input
                  type="text"
                  placeholder="Caption (optional)"
                  value={image.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  className="text-sm"
                />
                <Button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  disabled={image.isPrimary}
                  color={image.isPrimary ? "blue" : "zinc"}
                  outline={!image.isPrimary}
                  className="w-full text-xs"
                >
                  {image.isPrimary ? '✓ Primary Photo' : 'Set as Primary'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div className="flex flex-col items-center gap-3">
        <Button
          type="button"
          onClick={handleAddImageClick}
          color="blue"
          outline
          disabled={uploading}
          className="w-full sm:w-auto"
        >
          {uploading ? 'Uploading...' : 'Add Image'}
        </Button>

        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
