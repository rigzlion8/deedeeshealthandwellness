const cloudinary = require('../utils/cloudinary');

const streamUpload = (fileBuffer, folder = 'deedees-health') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(fileBuffer);
  });

exports.handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const hasCloudinaryConfig =
    cloudinary?.config()?.cloud_name &&
    cloudinary?.config()?.api_key &&
    cloudinary?.config()?.api_secret;

  if (!hasCloudinaryConfig) {
    const base64Preview = req.file.buffer.toString('base64');
    return res.json({
      success: true,
      provider: 'local-preview',
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `data:${req.file.mimetype};base64,${base64Preview}`,
      message: 'Cloudinary env vars missing – returning base64 preview instead.',
    });
  }

  try {
    const folder = req.body.folder || 'deedees-health';
    const result = await streamUpload(req.file.buffer, folder);

    res.json({
      success: true,
      provider: 'cloudinary',
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Image upload failed',
      details: error.message,
    });
  }
};

