const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const bucketName = process.env.S3_BUCKET_NAME || 'nomnomlog-images';

// Generate a pre-signed URL for uploading an image
function getSignedUploadUrl(fileName, fileType) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
    Expires: 60 * 5 // URL expires in 5 minutes
  };
  
  return s3.getSignedUrl('putObject', params);
}

// Generate a URL for viewing an image
function getImageUrl(fileName) {
  return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
}

// Delete an image from S3
async function deleteImage(fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName
  };
  
  return s3.deleteObject(params).promise();
}

module.exports = {
  getSignedUploadUrl,
  getImageUrl,
  deleteImage
};