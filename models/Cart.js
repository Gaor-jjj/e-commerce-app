const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
