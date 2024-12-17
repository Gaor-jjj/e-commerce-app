const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to the cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart if not found
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // If cart exists, check if the product already exists in the cart
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      
      if (existingItem) {
        // If product exists, update the quantity
        existingItem.quantity += quantity;
      } else {
        // Add new item to the cart
        cart.items.push({ product: productId, quantity });
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// View cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price');

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    // Update the quantity
    item.quantity = quantity;

    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Remove item from the cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Clear the cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Clear all items from the cart
    cart.items = [];

    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart, clearCart };
