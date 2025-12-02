const express = require('express');

const router = express.Router();

// Placeholder auth routes – extend with real auth logic when ready
router.get('/status', (req, res) => {
  res.json({
    service: 'auth',
    status: 'online',
    message: 'Authentication endpoints are not implemented yet.',
  });
});

router.all('*', (req, res) => {
  res.status(501).json({
    error: 'Auth route not implemented',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

