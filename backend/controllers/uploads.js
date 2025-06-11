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

module.exports = {
  getSignedUrl
};