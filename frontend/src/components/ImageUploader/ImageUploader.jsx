import { useState } from 'react';

export default function ImageUploader({ onImageUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Preview the selected image
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      setError(null);
      
      // Step 1: Get a signed URL from our backend
      const response = await fetch(`/api/uploads/sign?fileType=${encodeURIComponent(selectedFile.type)}`, {
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
      
      // Step 2: Upload the file directly to S3 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type
        },
        body: selectedFile
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      // Step 3: Call the callback with the permanent file URL
      onImageUploaded(fileUrl);
      
      // Clear the preview and selected file
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col items-center">
        {preview && (
          <div className="mb-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-w-xs rounded-lg shadow-md" 
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
            {selectedFile ? 'Change Image' : 'Select Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          
          {selectedFile && (
            <button
              type="button" // Important: type="button" prevents form submission
              onClick={uploadImage}
              disabled={uploading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}