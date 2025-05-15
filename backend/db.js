const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "cloudInventory",
    });
    console.log("✅ Connected to local MongoDB");
  } catch (err) {
    console.error("❌ Local MongoDB connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
