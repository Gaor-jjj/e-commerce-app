import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState(null);

  // Modal state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [registerDetails, setRegisterDetails] = useState({ email: '', password: '', name: '' });

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Adjust the URL based on your backend
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData)); // Set user data if available
    }
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', loginDetails);
      localStorage.setItem('user', JSON.stringify(response.data)); // Save user data in localStorage
      setUser(response.data); // Set the user state
      setIsLoginOpen(false); // Close login modal
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed');
    }
  };

  // Handle register
  const handleRegister = async () => {
    try {
      // Step 1: Register the user
      await axios.post('http://localhost:5000/api/users/register', registerDetails);
      alert('Registration successful, logging you in...');
  
      // Step 2: Automatically log in the user after registration
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email: registerDetails.email,
        password: registerDetails.password,
      });
  
      // Step 3: Save the user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data); // Set the user state
  
      setIsRegisterOpen(false); // Close register modal
  
      // Optionally close the login modal if it's open
      setIsLoginOpen(false);
  
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed');
    }
  };
  
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null); // Clear user state
  };

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

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
            {!user ? (
              <>
                <li>
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={() => setIsLoginOpen(true)} // Open login modal
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={() => setIsRegisterOpen(true)} // Open register modal
                  >
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span className="text-yellow-400">Welcome, {user.name}</span>
                </li>
                <li>
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 container mx-auto py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found for this category.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Food Shop. All rights reserved.</p>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 mb-4 w-full"
              value={loginDetails.email}
              onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 mb-4 w-full"
              value={loginDetails.password}
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 w-full"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="text-red-500 mt-4 w-full"
              onClick={() => setIsLoginOpen(false)} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Register</h2>
            <input
              type="text"
              placeholder="Name"
              className="border p-2 mb-4 w-full"
              value={registerDetails.name}
              onChange={(e) => setRegisterDetails({ ...registerDetails, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 mb-4 w-full"
              value={registerDetails.email}
              onChange={(e) => setRegisterDetails({ ...registerDetails, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 mb-4 w-full"
              value={registerDetails.password}
              onChange={(e) => setRegisterDetails({ ...registerDetails, password: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 w-full"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              className="text-red-500 mt-4 w-full"
              onClick={() => setIsRegisterOpen(false)} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
