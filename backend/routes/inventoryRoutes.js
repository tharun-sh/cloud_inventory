const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Add a product
router.post("/", async (req, res) => {
  console.log("POST /api/inventory - Body:", req.body); // Debug log
  const { name, quantity, price } = req.body;
  try {
    const newProduct = new Product({ name, quantity, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a product by name
router.put("/:name", async (req, res) => {
  console.log(
    "PUT /api/inventory/update - Params:",
    req.params,
    "Body:",
    req.body
  ); // Debug log
  const { name, quantity, price } = req.body;
  try {
    const updated = await Product.findOneAndUpdate(
      { name: req.params.name },
      { name, quantity, price },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product by name
router.delete("/:name", async (req, res) => {
  console.log("DELETE /api/inventory/delete - Params:", req.params); // Debug log
  try {
    const deleted = await Product.findOneAndDelete({ name: req.params.name });
    if (!deleted) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
