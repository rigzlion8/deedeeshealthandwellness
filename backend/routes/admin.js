const express = require('express');

const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({
    overview: {
      revenue: 125000,
      orders: 48,
      customers: 320,
      lowStock: 5,
    },
    message: 'Admin dashboard placeholder response',
  });
});

router.all('*', (req, res) => {
  res.status(501).json({
    error: 'Admin route not implemented for this method or path',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

