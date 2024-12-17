const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Remember to hash the password before saving
  isAdmin: { type: Boolean, default: false },
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
