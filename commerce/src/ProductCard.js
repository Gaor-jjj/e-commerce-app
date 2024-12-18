import React from 'react';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover mb-4"
      />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-700 mb-2">{product.description}</p>
        <p className="font-bold text-xl mb-4">${product.price}</p>
        <p className="text-gray-500 mb-4">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
