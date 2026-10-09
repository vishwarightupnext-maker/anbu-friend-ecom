import express from 'express';
import Order from '../models/Order.js';
import { isDbConnected } from '../config/db.js';
import { memoryOrders } from './paymentRoutes.js';

const router = express.Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isDbConnected) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.json(orders);
      }
    }
    res.json(memoryOrders);
  } catch (error) {
    res.json(memoryOrders);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected) {
      const order = await Order.findById(req.params.id);
      if (order) return res.json(order);
    }
    const order = memoryOrders.find(o => o._id === req.params.id || o.id === req.params.id);
    if (order) return res.json(order);
    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    const order = memoryOrders.find(o => o._id === req.params.id || o.id === req.params.id);
    if (order) return res.json(order);
    res.status(500).json({ message: 'Error retrieving order' });
  }
});

export default router;
