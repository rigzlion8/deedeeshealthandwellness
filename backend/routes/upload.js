const express = require('express');
const multer = require('multer');
const { adminAuth } = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post('/', adminAuth, upload.single('file'), uploadController.handleUpload);

router.all('*', (req, res) => {
  res.status(405).json({
    error: 'Unsupported upload route',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

