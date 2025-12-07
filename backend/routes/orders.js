const express = require('express');
const mongoose = require('mongoose');
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

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Order must contain at least one item',
        received: { items }
      });
    }

    if (subtotal === undefined || subtotal === null || totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({
        error: 'Subtotal and total amount are required',
        received: { subtotal, totalAmount }
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        error: 'Payment method is required',
        received: { paymentMethod }
      });
    }

    // Validate and format items
    const validatedItems = items.map(item => {
      if (!item.product) {
        throw new Error('Each item must have a product ID');
      }
      
      // Validate product ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }

      return {
        product: item.product,
        name: item.name || '',
        price: item.price || 0,
        discountPrice: item.discountPrice || item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || ''
      };
    });

    // Validate user ID if provided
    let validatedUser = null;
    if (user) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
          error: 'Invalid user ID format'
        });
      }
      validatedUser = user;
    }

    // Create new order
    const newOrder = new Order({
      user: validatedUser,
      items: validatedItems,
      shippingAddress: shippingAddress || {},
      paymentMethod,
      subtotal: parseFloat(subtotal) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing'
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Return 400 for validation errors, 500 for server errors
    const statusCode = error.name === 'ValidationError' || error.message.includes('required') || error.message.includes('Invalid') ? 400 : 500;
    
    res.status(statusCode).json({
      error: 'Failed to create order',
      details: error.message,
      validationErrors: error.errors || undefined
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

