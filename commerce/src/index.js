// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from react-dom/client
import './index.css';  // Import Tailwind styles
import App from './App'; // Main App component

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component using createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
