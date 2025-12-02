const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post(
  '/paystack/initialize',
  paymentController.initializePayment.bind(paymentController)
);

router.get(
  '/paystack/verify/:reference',
  paymentController.verifyPayment.bind(paymentController)
);

router.post(
  '/mpesa/initiate',
  paymentController.initiateMpesaPayment.bind(paymentController)
);

router.post(
  '/mpesa/callback',
  paymentController.mpesaCallback.bind(paymentController)
);

router.get('/health', (req, res) => {
  res.json({
    service: 'payments',
    status: 'online',
  });
});

module.exports = router;

