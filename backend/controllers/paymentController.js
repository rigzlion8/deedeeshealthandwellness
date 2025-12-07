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
    try {
      const { phoneNumber, amount, orderId } = req.body;

      // Validate required fields
      if (!phoneNumber || !amount || !orderId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: phoneNumber, amount, and orderId are required'
        });
      }

      // Validate environment variables
      if (!process.env.MPESA_BUSINESS_SHORT_CODE || !process.env.MPESA_PASSKEY || 
          !process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
        console.error('M-Pesa environment variables missing');
        return res.status(500).json({
          success: false,
          message: 'M-Pesa configuration error: Missing environment variables'
        });
      }

      // Format phone number (remove + and spaces, ensure it starts with 254)
      let formattedPhone = phoneNumber.replace(/[\s+]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = `254${formattedPhone.slice(1)}`;
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = `254${formattedPhone.slice(-9)}`;
      }

      // Ensure amount is a number
      const paymentAmount = Math.round(parseFloat(amount));

      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount: Amount must be a positive number'
        });
      }

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(
        `${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString('base64');

      const payload = {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentAmount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BACKEND_URL || process.env.MPESA_CALLBACK_URL || 'https://deedeeshealthandwellness-backend.fly.dev'}/api/payments/mpesa/callback`,
        AccountReference: `ORDER-${orderId}`,
        TransactionDesc: 'DeeDees Health & Wellness Purchase'
      };

      // Get M-Pesa access token
      const accessToken = await this.getMpesaToken();

      // Initiate STK Push
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update order with payment details
      await Order.findByIdAndUpdate(orderId, {
        'paymentStatus': 'processing',
        'paymentDetails.phoneNumber': formattedPhone,
        'paymentDetails.transactionId': response.data.CheckoutRequestID,
        'paymentDetails.amount': paymentAmount
      });

      res.json({
        success: true,
        message: 'M-Pesa payment initiated',
        data: response.data
      });
    } catch (error) {
      console.error('M-Pesa payment initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'M-Pesa payment failed',
        error: error.response?.data?.errorMessage || error.response?.data || error.message
      });
    }
  }

  // M-Pesa Callback
  async mpesaCallback(req, res) {
    try {
      const callbackData = req.body;
      
      if (!callbackData.Body || !callbackData.Body.stkCallback) {
        console.error('Invalid callback data structure:', callbackData);
        return res.json({ ResultCode: 1, ResultDesc: 'Invalid callback data' });
      }

      const stkCallback = callbackData.Body.stkCallback;
      
      if (stkCallback.ResultCode === 0) {
        // Payment successful
        const metadata = stkCallback.CallbackMetadata?.Item || [];
        const amount = metadata.find(item => item.Name === 'Amount')?.Value;
        const transactionId = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

        // Extract order ID from AccountReference (format: ORDER-{orderId})
        const accountRef = stkCallback.MerchantRequestID || stkCallback.CheckoutRequestID;
        let orderId = null;
        
        if (accountRef) {
          // Try to extract from MerchantRequestID or CheckoutRequestID
          const orderMatch = accountRef.match(/ORDER-([a-f0-9]{24})/i);
          if (orderMatch) {
            orderId = orderMatch[1];
          } else {
            // Fallback: try to find order by CheckoutRequestID stored in paymentDetails
            const order = await Order.findOne({
              'paymentDetails.transactionId': accountRef
            });
            if (order) {
              orderId = order._id.toString();
            }
          }
        }

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            'paymentStatus': 'completed',
            'orderStatus': 'confirmed',
            'paymentDetails.amount': amount,
            'paymentDetails.transactionId': transactionId,
            'paymentDetails.phoneNumber': phoneNumber,
            'paymentDetails.paymentDate': new Date()
          });

          console.log(`Order ${orderId} payment completed successfully`);
          // TODO: Send confirmation email
        } else {
          console.error('Could not extract order ID from callback:', accountRef);
        }
      } else {
        // Payment failed
        const resultDesc = stkCallback.ResultDesc || 'Payment failed';
        console.error('M-Pesa payment failed:', resultDesc);
        
        // Try to find and update order status
        const accountRef = stkCallback.MerchantRequestID || stkCallback.CheckoutRequestID;
        if (accountRef) {
          const order = await Order.findOne({
            'paymentDetails.transactionId': accountRef
          });
          if (order) {
            await Order.findByIdAndUpdate(order._id, {
              'paymentStatus': 'failed'
            });
          }
        }
      }

      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
      console.error('M-Pesa callback error:', error);
      res.json({ ResultCode: 1, ResultDesc: 'Callback processing failed' });
    }
  }

  async getMpesaToken() {
    try {
      if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
        throw new Error('M-Pesa consumer key and secret are required');
      }

      const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
      ).toString('base64');

      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: { Authorization: `Basic ${auth}` }
        }
      );

      if (!response.data.access_token) {
        throw new Error('Failed to obtain M-Pesa access token');
      }

      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa token generation error:', error);
      throw new Error(`M-Pesa authentication failed: ${error.response?.data?.error || error.message}`);
    }
  }
}

module.exports = new PaymentController();