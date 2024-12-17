const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');  // To check if user is authenticated

// Route to create a new product (requires authentication)
router.post('/', authMiddleware, ProductController.createProduct);

// Route to get all products (public)
router.get('/', ProductController.getAllProducts);

// Route to get a product by ID (public)
router.get('/:id', ProductController.getProductById);

// Route to update a product by ID (requires authentication)
router.put('/:id', authMiddleware, ProductController.updateProduct);

// Route to delete a product by ID (requires authentication)
router.delete('/:id', authMiddleware, ProductController.deleteProduct);

module.exports = router;
