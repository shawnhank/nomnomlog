const s3Service = require('../services/s3Service');
const { v4: uuidv4 } = require('uuid');

// Generate a pre-signed URL for uploading an image
async function getSignedUrl(req, res) {
  console.log('getSignedUrl controller called', {
    fileType: req.query.fileType,
    user: req.user ? req.user._id : 'No user'
  });
   
  try {
    const fileType = req.query.fileType;
    const userId = req.user._id;
    
    // Validate file type
    if (!fileType.match(/^image\/(jpeg|png|gif|jpg)$/)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }
    
    // Generate a unique file name
    const extension = fileType.split('/')[1];
    const fileName = `${userId}/${uuidv4()}.${extension}`;
    
    // Get a signed URL
    const signedUrl = s3Service.getSignedUploadUrl(fileName, fileType);
    
    // Return the URL and the file name (to save in the database)
    res.json({
      signedUrl,
      fileName,
      fileUrl: s3Service.getImageUrl(fileName)
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ message: 'Error generating upload URL' });
  }
}

// Add a new endpoint to proxy the upload
async function proxyUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileType = req.file.mimetype;
    const userId = req.user._id;
    
    // Validate file type
    if (!fileType.match(/^image\/(jpeg|png|gif|jpg)$/)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }
    
    // Generate a unique file name
    const extension = fileType.split('/')[1];
    const fileName = `${userId}/${uuidv4()}.${extension}`;
    
    console.log('Uploading file to S3:', {
      fileName,
      fileType,
      fileSize: req.file.size
    });
    
    // Upload directly to S3 from the server
    const uploadResult = await s3Service.uploadFile(fileName, fileType, req.file.buffer);
    
    // Return the file URL
    res.json({
      fileName,
      fileUrl: s3Service.getImageUrl(fileName)
    });
  } catch (error) {
    console.error('Error proxying upload:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
}

// Add a new function to proxy image requests
async function proxyImage(req, res) {
  try {
    // Get the userId and imageId from the URL parameters
    const userId = req.params.userId;
    const imageId = req.params.imageId;
    const path = `${userId}/${imageId}`;
    
    console.log('Proxying image request for:', path);
    
    // Create params for getting the object
    const params = {
      Bucket: s3Service.getBucketName(),
      Key: path
    };
    
    // Get the object from S3
    const s3Stream = s3Service.getS3().getObject(params).createReadStream();
    
    // Set appropriate headers based on file extension
    const fileExtension = imageId.split('.').pop().toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      contentType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      contentType = 'image/png';
    } else if (fileExtension === 'gif') {
      contentType = 'image/gif';
    }
    
    res.set('Content-Type', contentType);
    
    // Pipe the S3 stream to the response
    s3Stream.pipe(res);
    
    // Handle errors
    s3Stream.on('error', (err) => {
      console.error('Error streaming image from S3:', err);
      // Only send error if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(404).json({ message: 'Image not found' });
      }
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ message: 'Error retrieving image' });
  }
}

module.exports = {
  getSignedUrl,
  proxyUpload,
  proxyImage
};
