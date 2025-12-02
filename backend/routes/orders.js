const express = require('express');

const router = express.Router();

const SAMPLE_ORDERS = [
  {
    _id: 'order-001',
    orderNumber: 'ORD-250101-0001',
    status: 'processing',
    totalAmount: 4500,
    paymentStatus: 'pending',
  },
];

router.get('/', (req, res) => {
  res.json(SAMPLE_ORDERS);
});

router.get('/:id', (req, res) => {
  const order = SAMPLE_ORDERS.find((item) => item._id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

router.all('*', (req, res) => {
  res.status(501).json({
    error: 'Order route not implemented for this method or path',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

