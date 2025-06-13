import { useState, useRef, useEffect } from 'react';
import { Button } from '../catalyst/button';
import { Input } from '../catalyst/input';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function MultiImageUploader({
  images = [],
  onImagesUpdated,
  entityType = 'meal', // Can be 'user', 'restaurant', or 'meal'
  renderAddButton = true, // New prop to control button rendering
  addButtonRef = null, // New prop to expose the add button functionality
  captureMode = null // New prop: null (default), 'user', or 'environment'
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Expose the handleAddImageClick function via ref if provided
  useEffect(() => {
    if (addButtonRef) {
      addButtonRef.current = {
        handleAddImageClick: () => {
          if (captureMode === 'environment' || captureMode === 'user') {
            startCamera();
          } else {
            handleGalleryClick();
          }
        }
      };
    }
  }, [addButtonRef, captureMode]);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Get available video devices when camera modal opens
  useEffect(() => {
    if (showCameraModal) {
      getVideoDevices();
    }
  }, [showCameraModal]);

  // Get available video devices
  const getVideoDevices = async () => {
    try {
      // First request permission to access media devices
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Then enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      
      setVideoDevices(videoInputs);
      
      // Select the first device by default, or the one matching captureMode if possible
      if (videoInputs.length > 0) {
        // Try to find a device that matches the requested facing mode
        if (captureMode === 'environment') {
          const backCamera = videoInputs.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear')
          );
          if (backCamera) {
            setSelectedDeviceId(backCamera.deviceId);
            return;
          }
        } else if (captureMode === 'user') {
          const frontCamera = videoInputs.find(device => 
            device.label.toLowerCase().includes('front') || 
            device.label.toLowerCase().includes('facetime')
          );
          if (frontCamera) {
            setSelectedDeviceId(frontCamera.deviceId);
            return;
          }
        }
        
        // Default to first device if no matching device found
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.error('Error enumerating video devices:', err);
      setError('Could not access camera devices. Please check permissions.');
    }
  };

  // Start camera with selected device
  const startCamera = async () => {
    try {
      // Close any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Configure constraints based on selected device or facing mode
      const constraints = { 
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } }
          : { facingMode: captureMode }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setShowCameraModal(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      // Fall back to file input
      fileInputRef.current?.click();
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      // Create a file from the blob
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setShowCameraModal(false);
      
      // Upload the file
      await uploadFile(file);
    }, 'image/jpeg');
  };

  // Close camera modal
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setShowCameraModal(false);
  };

  // Change camera device
  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
    // Restart camera with new device
    if (deviceId) {
      const constraints = { 
        video: { deviceId: { exact: deviceId } }
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
          // Stop previous stream
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          // Set new stream
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(err => {
          console.error('Error switching camera:', err);
          setError('Failed to switch camera device.');
        });
    }
  };

  // Upload file function (extracted from handleFileSelect)
  const uploadFile = async (file) => {
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

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    await uploadFile(file);
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

  const handleGalleryClick = () => {
    // Create a new file input element with specific accept types
    const input = document.createElement('input');
    input.type = 'file';
    
    // Accept common image formats
    input.accept = 'image/*,.jpg,.jpeg,.png,.heic,.heif';
    
    // Add capture attribute for mobile devices
    // Note: This won't affect desktop browsers but helps on mobile
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      input.capture = 'none'; // Prevents camera from opening on iOS
    }
    
    // Handle file selection
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadFile(file);
      }
    };
    
    // Trigger click to open file picker
    input.click();
  };

  const handleAddImageClick = () => {
    if (captureMode === 'environment' || captureMode === 'user') {
      startCamera();
    } else {
      handleGalleryClick();
    }
  };

  // New function to render the Add Image button
  const renderAddImageButton = () => (
    <Button
      type="button"
      onClick={handleAddImageClick}
      color="blue"
      outline
      disabled={uploading}
      className="w-full sm:w-auto border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200"
    >
      {uploading ? 'Uploading...' : (
        <span className="flex items-center">
          <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          Add Image
        </span>
      )}
    </Button>
  );

  // Get the appropriate field name based on entity type
  const getFieldName = () => {
    switch(entityType) {
      case 'user': return 'userImages';
      case 'restaurant': return 'restaurantImages';
      case 'meal': 
      default: return 'mealImages';
    }
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
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full border border-red-500 bg-white hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                  aria-label="Remove image"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
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
                  positive={!image.isPrimary}
                  color={image.isPrimary ? "blue" : undefined}
                  className="w-full text-xs font-normal"
                >
                  {image.isPrimary ? '✓ Primary Photo' : 'Set as Primary'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button - only render if renderAddButton is true */}
      {renderAddButton && (
        <div className="flex flex-col items-center gap-3">
          {renderAddImageButton()}

          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Camera modal with device selection */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">Take a Photo</h3>
              <button 
                onClick={closeCamera}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Camera device selector */}
            {videoDevices.length > 1 && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <select 
                  value={selectedDeviceId || ''}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {videoDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-auto"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="p-4 flex justify-center">
              <Button
                type="button"
                onClick={capturePhoto}
                positive
                className="px-4 py-2"
              >
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
