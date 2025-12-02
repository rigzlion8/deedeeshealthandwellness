const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');

class PaymentController {
  // PayStack Payment
  async initializePayment(req, res) {
    const { email, amount, orderId, metadata } = req.body;
    
    try {
      const payment = await Paystack.transaction.initialize({
        email,
        amount: amount * 100, // Convert to kobo
        currency: 'KES',
        metadata: {
          orderId,
          ...metadata
        },
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`
      });

      res.json({
        success: true,
        authorization_url: payment.data.authorization_url,
        access_code: payment.data.access_code,
        reference: payment.data.reference
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Payment initialization failed',
        error: error.message
      });
    }
  }

  // Verify PayStack Payment
  async verifyPayment(req, res) {
    const { reference } = req.params;

    try {
      const verification = await Paystack.transaction.verify(reference);
      
      if (verification.data.status === 'success') {
        const orderId = verification.data.metadata.orderId;
        await Order.findByIdAndUpdate(orderId, {
          'paymentStatus': 'completed',
          'paymentDetails.transactionId': reference,
          'paymentDetails.paymentDate': new Date()
        });

        res.json({
          success: true,
          message: 'Payment verified successfully',
          data: verification.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Verification failed',
        error: error.message
      });
    }
  }

  // M-Pesa STK Push
  async initiateMpesaPayment(req, res) {
    const { phoneNumber, amount, orderId } = req.body;
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: `254${phoneNumber.slice(-9)}`, // Convert to Kenyan format
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: `254${phoneNumber.slice(-9)}`,
      CallBackURL: `${process.env.BACKEND_URL}/api/payments/mpesa-callback`,
      AccountReference: `ORDER-${orderId}`,
      TransactionDesc: 'DeeDees Health & Wellness Purchase'
    };

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${await this.getMpesaToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await Order.findByIdAndUpdate(orderId, {
        'paymentStatus': 'processing',
        'paymentDetails.phoneNumber': phoneNumber,
        'paymentDetails.transactionId': response.data.CheckoutRequestID
      });

      res.json({
        success: true,
        message: 'M-Pesa payment initiated',
        data: response.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'M-Pesa payment failed',
        error: error.response?.data || error.message
      });
    }
  }

  // M-Pesa Callback
  async mpesaCallback(req, res) {
    const callbackData = req.body;
    
    if (callbackData.Body.stkCallback.ResultCode === 0) {
      const metadata = callbackData.Body.stkCallback.CallbackMetadata.Item;
      const amount = metadata.find(item => item.Name === 'Amount').Value;
      const transactionId = metadata.find(item => item.Name === 'MpesaReceiptNumber').Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber').Value;

      // Extract order ID from AccountReference
      const accountRef = callbackData.Body.stkCallback.MerchantRequestID;
      const orderId = accountRef.split('-')[1];

      await Order.findByIdAndUpdate(orderId, {
        'paymentStatus': 'completed',
        'paymentDetails.amount': amount,
        'paymentDetails.transactionId': transactionId,
        'paymentDetails.phoneNumber': phoneNumber,
        'paymentDetails.paymentDate': new Date()
      });

      // TODO: Send confirmation email
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  }

  async getMpesaToken() {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    );

    return response.data.access_token;
  }
}

module.exports = new PaymentController();