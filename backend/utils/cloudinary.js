const cloudinary = require('cloudinary').v2;

// Support both naming conventions for flexibility
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  // eslint-disable-next-line no-console
  console.warn(
    '[Cloudinary] Credentials missing – uploads will fall back to base64 previews only.'
  );
}

module.exports = cloudinary;

