const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route to create a new product
router.post('/', ProductController.createProduct);

// Route to get all products
router.get('/', ProductController.getAllProducts);

// Route to get a product by ID
router.get('/:id', ProductController.getProductById);

// Route to update a product by ID
router.put('/:id', ProductController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
