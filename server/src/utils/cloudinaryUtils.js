import cloudinaryClient from '../config/cloudinary.js';
import streamifier from 'streamifier';

/**
 * Upload a buffer to Cloudinary and return the secure URL.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Cloudinary folder name
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<string>} Secure URL of the uploaded file
 */
export const uploadToCloudinary = (buffer, folder = 'hustlr', options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinaryClient.uploader.upload_stream(
      { folder, ...options },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * Delete a file from Cloudinary by public_id.
 */
export const deleteFromCloudinary = async (publicId) => {
  await cloudinaryClient.uploader.destroy(publicId);
};
