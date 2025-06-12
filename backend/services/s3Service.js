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
  // Use our proxy endpoint instead of direct S3 URL
  return `/api/uploads/images/${fileName}`;
}

// Delete an image from S3
async function deleteImage(fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName
  };
  
  return s3.deleteObject(params).promise();
}

// Add a new function to upload a file directly from the server
async function uploadFile(fileName, fileType, fileBuffer) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType
    // Removed ACL: 'public-read' as the bucket doesn't support ACLs
  };
  
  try {
    const result = await s3.upload(params).promise();
    console.log('File uploaded successfully:', result.Location);
    return result;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

// Configure CORS for the S3 bucket
async function configureBucketCORS() {
  const corsConfig = {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["PUT", "POST", "DELETE", "GET", "HEAD"],
        AllowedOrigins: [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://nomnomlog.thisdemo.rocks",
          "http://nomnomlog.thisdemo.rocks",
          "*"  // Allow all origins temporarily during development
        ],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000
      }
    ]
  };

  try {
    await s3.putBucketCors({
      Bucket: bucketName,
      CORSConfiguration: corsConfig
    }).promise();
    console.log('S3 CORS configuration updated successfully');
  } catch (error) {
    console.error('Error updating S3 CORS configuration:', error);
  }
}

// Add these functions to expose the bucket name and S3 instance
function getBucketName() {
  return bucketName;
}

function getS3() {
  return s3;
}

module.exports = {
  getSignedUploadUrl,
  getImageUrl,
  deleteImage,
  configureBucketCORS,
  uploadFile,
  getBucketName,
  getS3
};
