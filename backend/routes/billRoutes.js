const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const Product = require("../models/Product");

// Get all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new bill and update inventory
router.post("/", async (req, res) => {
  const { productName, quantity } = req.body;

  try {
    const product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Deduct stock
    product.quantity -= quantity;
    if (product.quantity === 0) {
      await Product.deleteOne({ _id: product._id });
    } else {
      await product.save();
    }

    // Create bill
    const newBill = new Bill({ productName, quantity });
    await newBill.save();

    res.status(201).json(newBill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
