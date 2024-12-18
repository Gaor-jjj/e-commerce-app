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

router.post('/add', addToCart); // Add item to cart
router.get('/', getCart); // View cart
router.put('/update', updateCartItem); // Update cart item
router.delete('/remove', removeFromCart); // Remove item from cart
router.delete('/clear', clearCart); // Clear cart

module.exports = router;
