const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'price');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totalAmount
    const totalAmount = cart.items.reduce((total, item) => {
      if (!item.product.price) {
        throw new Error(`Price not found for product ID: ${item.product._id}`);
      }
      return total + item.quantity * item.product.price;
    }, 0);

    // Create a new order
    const newOrder = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount, // Use the correctly calculated totalAmount
    });

    // Save the order
    await newOrder.save();

    // Clear the user's cart by removing all items
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get all orders for a user
const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.product', 'name price'); // Populating product info
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.product', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update order status (e.g., from 'Pending' to 'Shipped')
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Valid statuses: 'Pending', 'Shipped', 'Completed'
    const validStatuses = ['Pending', 'Shipped', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrdersForUser,
  getOrderById,
  updateOrderStatus,
};
