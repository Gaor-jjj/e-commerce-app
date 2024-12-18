const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating a unique ID for guests

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null }, // Make user optional
    guestId: { type: String, default: () => uuidv4() }, // Add a guestId for guest users
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // This will automatically create `createdAt` and `updatedAt`
);

// Pre-save middleware to update the `updatedAt` field manually
cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now(); // Automatically updates `updatedAt` when the cart is saved
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
