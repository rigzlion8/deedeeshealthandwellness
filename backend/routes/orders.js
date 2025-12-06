const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      user,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      totalAmount
    } = req.body;

    // Create new order
    const newOrder = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing'
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
});

// Get all orders for a user (requires authentication)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      error: 'Failed to fetch order',
      details: error.message
    });
  }
});

router.all('*', (req, res) => {
  res.status(501).json({
    error: 'Order route not implemented for this method or path',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

