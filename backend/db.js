const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const localUri = process.env.LOCAL_MONGO_URI;
    const atlasUri = process.env.ATLAS_MONGO_URI;

    // Try connecting to MongoDB Atlas
    console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.warn("⚠️ Atlas connection failed. Attempting local MongoDB...");
    try {
      await mongoose.connect(process.env.LOCAL_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to Local MongoDB");
    } catch (localErr) {
      console.error(
        "❌ Both Atlas and Local MongoDB connections failed:",
        localErr.message
      );
      process.exit(1);
    }
  }
};

module.exports = connectDB;
