import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import cartIcon from './images/cart.png';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    if (product.stock > 0) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, stock: p.stock - 1 } : p
        )
      );

      setCart((prev) => {
        const existing = prev.find((item) => item._id === product._id);
        if (existing) {
          return prev.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Calculate total cost of the cart
  const calculateTotalCost = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-500">Food Shop</h1>
          <ul className="flex space-x-4">
            {['All', 'Fruits', 'Vegetables', 'Snacks', 'Beverages', 'Pastry', 'Meat'].map((category) => (
              <li key={category}>
                <button
                  className={`${
                    selectedCategory === category
                      ? 'text-yellow-400 font-bold'
                      : 'hover:text-yellow-400'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
          <div
            className="bg-white p-2 rounded-md cursor-pointer flex items-center justify-center"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <img src={cartIcon} alt="Cart" className="w-6 h-6" />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 container mx-auto py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found for this category.</p>
        )}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            {cart.length > 0 ? (
              <ul>
                {cart.map((item) => (
                  <li key={item._id} className="flex justify-between mb-2">
                    <span>{item.name}</span>
                    <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                  </li>
                ))}
                <hr className="my-4" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotalCost()}</span>
                </div>
              </ul>
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
              onClick={() => setIsCartOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Food Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
