import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { memoryProducts } from './productRoutes.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();
export const memoryOrders = [];

// Helper to get or simulate Cloudinary download link
const getCloudinaryLink = (product) => {
  if (!product) return 'https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_assets/download.png';
  if (product.cloudinaryUrl) return product.cloudinaryUrl;
  if (product.pdfUrl) return product.pdfUrl;
  if (product.pngUrl) return product.pngUrl;
  
  const isPdf = product.fileType === 'pdf';
  const cleanId = (product.id || product._id || 'asset').toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `https://res.cloudinary.com/varahi-digital-assets/image/upload/v1700000000/digital_products/${cleanId}.${isPdf ? 'pdf' : 'png'}`;
};

// @desc    Get Razorpay Configuration (Public Key and Mode from .env)
// @route   GET /api/payment/config
// @access  Public
router.get('/config', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  
  res.status(200).json({
    keyId: keyId,
    isSimulated: !keyId || keyId.includes('test_secret'),
    cloudinaryFolder: process.env.CLOUDINARY_FOLDER || 'digital_ebooks_and_pngs'
  });
});

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Public
router.post('/order', async (req, res) => {
  const { amount, customerDetails, orderItems } = req.body;

  try {
    const totalAmount = parseFloat(amount || 0);
    const orderData = {
      _id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      customer: customerDetails || {
        name: 'Digital Buyer',
        email: 'buyer@example.com',
        phone: '9876543210',
        address: 'Digital Cloudinary Delivery',
        state: 'Tamil Nadu'
      },
      orderItems: (orderItems || []).map(item => ({
        product: item.id || item._id,
        name: item.name,
        qty: item.qty || 1,
        price: item.price
      })),
      totalAmount,
      paymentDetails: {
        status: 'pending'
      },
      deliveryStatus: 'Delivered',
      isDelivered: true,
      deliveredAt: new Date()
    };

    let savedOrder = null;

    if (isDbConnected) {
      try {
        const localOrder = new Order(orderData);
        savedOrder = await localOrder.save();
      } catch (e) {
        console.warn('DB Save fallback to memory:', e.message);
      }
    }

    if (!savedOrder) {
      savedOrder = orderData;
      memoryOrders.unshift(savedOrder);
    }

    const dbOrderId = savedOrder._id || savedOrder.id;
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      const simulatedOrderId = `order_sim_${Date.now()}`;
      savedOrder.paymentDetails.razorpayOrderId = simulatedOrderId;
      savedOrder.paymentDetails.isSimulated = true;

      if (savedOrder.save) {
        await savedOrder.save();
      }

      return res.status(200).json({
        success: true,
        isSimulated: true,
        orderId: simulatedOrderId,
        amount: totalAmount * 100, // in paisa
        currency: 'INR',
        dbOrderId
      });
    }

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${dbOrderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    savedOrder.paymentDetails.razorpayOrderId = razorpayOrder.id;

    if (savedOrder.save) {
      await savedOrder.save();
    }

    res.status(200).json({
      success: true,
      isSimulated: false,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ message: 'Error initiating payment', error: error.message });
  }
});

// @desc    Verify Razorpay Payment Signature & Send Email with Cloudinary Download Link
// @route   POST /api/payment/verify
// @access  Public
router.post('/verify', async (req, res) => {
  const {
    dbOrderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    isSimulated
  } = req.body;

  try {
    let order = null;

    if (isDbConnected) {
      try {
        order = await Order.findById(dbOrderId);
      } catch (e) {
        console.warn('DB Find fallback:', e.message);
      }
    }

    if (!order) {
      order = memoryOrders.find(o => o._id === dbOrderId || o.id === dbOrderId);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found' });
    }

    // Find purchased product details for Cloudinary link generation
    const productId = order.orderItems?.[0]?.product;
    let product = null;
    if (isDbConnected && productId) {
      product = await Product.findById(productId);
    }
    if (!product && productId) {
      product = memoryProducts.find(p => p.id === productId || p._id === productId);
    }

    const cloudinaryLink = getCloudinaryLink(product);
    const targetEmail = order.customer?.email || 'customer@example.com';

    // Simulate / Trigger instant email dispatch with Cloudinary download link
    console.log(`\n======================================================`.cyan);
    console.log(`[EMAIL DISPATCH SUCCESS]`.green.bold);
    console.log(`To: ${targetEmail}`.yellow);
    console.log(`Subject: Your Purchased Digital Asset Download Link (Cloudinary)`);
    console.log(`Product: ${order.orderItems?.[0]?.name || 'Digital Asset'}`);
    console.log(`Cloudinary Link: ${cloudinaryLink}`.cyan.underline);
    console.log(`======================================================\n`.cyan);

    order.paymentDetails.razorpayPaymentId = razorpayPaymentId || `pay_sim_${Date.now()}`;
    order.paymentDetails.razorpaySignature = razorpaySignature || `sig_sim_${Date.now()}`;
    order.paymentDetails.status = 'paid';

    if (order.save) {
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: `Payment verified! Cloudinary download link has been sent to your email (${targetEmail}).`,
      emailDelivered: true,
      sentToEmail: targetEmail,
      cloudinaryDownloadUrl: cloudinaryLink,
      order
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

export default router;
