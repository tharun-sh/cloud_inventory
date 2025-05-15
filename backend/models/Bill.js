const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30, // Auto-delete after 30 days
  },
  synced: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Bill", billSchema);
