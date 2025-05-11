const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const cors = require("cors");

const inventoryRoutes = require("./routes/inventoryRoutes");
const billRoutes = require("./routes/billRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Atlas first, fallback to local)
connectDB()
  .then(() => {
    console.log("✅ MongoDB connection established.");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB is not connected
  });

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/bills", billRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("📦 Inventory & 🧾 Billing API Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
