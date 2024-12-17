const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

router.post('/add', authMiddleware, addToCart); // Add item to cart
router.get('/', authMiddleware, getCart); // View cart
router.put('/update', authMiddleware, updateCartItem); // Update cart item
router.delete('/remove', authMiddleware, removeFromCart); // Remove item from cart
router.delete('/clear', authMiddleware, clearCart); // Clear cart

module.exports = router;
