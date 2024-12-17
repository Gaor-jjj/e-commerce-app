const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrdersForUser,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

// Create an order (requires user to be authenticated)
router.post('/', authMiddleware, createOrder);

// Get all orders for the logged-in user
router.get('/', authMiddleware, getOrdersForUser);

// Get a specific order by ID
router.get('/:id', authMiddleware, getOrderById);

// Update order status (requires admin or higher role in future)
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
