import { useState } from 'react';

export default function MultiImageUploader({ 
  images = [], 
  onImagesUpdated,
  entityType = 'meal' // Can be 'user', 'restaurant', or 'meal'
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

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
      
      // Get a signed URL from our backend
      const response = await fetch(`/api/uploads/sign?fileType=${encodeURIComponent(file.type)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }
      
      const data = await response.json();
      const { signedUrl, fileUrl } = data;
      
      // Upload the file directly to S3 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      // Create a new image object
      const newImage = {
        url: fileUrl,
        isPrimary: images.length === 0, // First image is primary by default
        caption: ''
      };
      
      // Update the images array
      const updatedImages = [...images, newImage];
      
      // Call the callback with the appropriate field name
      onImagesUpdated({ [getFieldName()]: updatedImages });
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
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

  return (
    <div className="mb-4">
      <div className="flex flex-col items-center">
        {/* Image gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4 w-full">
            {images.map((image, index) => (
              <div key={index} className={`relative border rounded-lg p-1 ${image.isPrimary ? 'border-blue-500' : 'border-gray-300'}`}>
                <img 
                  src={image.url} 
                  alt={image.caption || `Image ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-md" 
                />
                <div className="mt-1 flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image.caption || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="text-xs p-1 border rounded"
                  />
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      disabled={image.isPrimary}
                      className="text-xs px-1 py-0.5 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      {image.isPrimary ? 'Primary' : 'Set Primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-xs px-1 py-0.5 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload button */}
        <div className="flex items-center space-x-2">
          <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 disabled:bg-gray-400">
            {uploading ? 'Uploading...' : 'Add Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
