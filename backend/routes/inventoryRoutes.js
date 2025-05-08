const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a product
router.post("/", async (req, res) => {
  const { name, quantity } = req.body;
  try {
    const newProduct = new Product({ name, quantity });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  const { name, quantity } = req.body;
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, quantity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
