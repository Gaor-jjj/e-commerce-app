const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrdersForUser,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

// Create an order (no auth required for guests or logged-in users)
router.post('/', createOrder); // Now available for both guests and authenticated users

// Get all orders for the logged-in user (auth required)
router.get('/', authMiddleware, getOrdersForUser); // Only for authenticated users

// Get a specific order by ID (auth required)
router.get('/:id', authMiddleware, getOrderById); // Only for authenticated users

// Update order status (auth required)
router.put('/:id/status', authMiddleware, updateOrderStatus); // Admin or higher roles required in future

module.exports = router;
