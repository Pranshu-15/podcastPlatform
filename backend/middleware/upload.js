const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
require('dotenv').config();

// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage — we'll stream to Cloudinary manually
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Uploads a buffer to Cloudinary using upload_stream.
 * @param {Buffer} buffer - File buffer from multer
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'podcastPlatform', resource_type: 'auto', ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = { upload, uploadToCloudinary };
