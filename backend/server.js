const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db"); // updated: connects only to local
const syncToAtlas = require("./sync");

const inventoryRoutes = require("./routes/inventoryRoutes");
const billRoutes = require("./routes/billRoutes");

// Load environment variables
dotenv.config();

// Add this at the very top of your main file
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  // Optionally: Do not exit, or implement retry logic here
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally: Do not exit, or implement cleanup/retry logic here
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to local MongoDB
connectDB()
  .then(() => {
    console.log("✅ MongoDB connection established.");

    // 🕒 Start periodic sync from local to Atlas every 60 seconds
    setInterval(() => {
      try {
        console.log("🌐 Syncing to Atlas...");
        syncToAtlas();
      } catch (error) {
        console.error("❌ Sync to Atlas failed:", error.message);
      }
    }, 20 * 1000);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    //process.exit(1); // Exit if DB is not connected
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
