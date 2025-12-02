const express = require('express');

const router = express.Router();

router.get('/summary', (req, res) => {
  res.json({
    sales: {
      daily: 12000,
      weekly: 84500,
      monthly: 320000,
      currency: 'KES',
    },
    topCategories: [
      { name: 'Herbal', share: 0.4 },
      { name: 'Skincare', share: 0.35 },
      { name: 'Supplements', share: 0.25 },
    ],
  });
});

router.all('*', (req, res) => {
  res.status(501).json({
    error: 'Analytics route not implemented for this method or path',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

