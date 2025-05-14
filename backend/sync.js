const Product = require("./models/Product");
const Bill = require("./models/Bill");
const axios = require("axios");
const mongoose = require("mongoose");

const atlasUri = process.env.ATLAS_URI;
let atlasConnection = null;

async function connectAtlas() {
  if (!atlasConnection) {
    atlasConnection = await mongoose.createConnection(atlasUri, {
      dbName: "cloudInventory",
    });
  }
  return atlasConnection;
}

async function syncToAtlas() {
  try {
    // Check internet connection
    await axios.get("https://www.google.com");

    console.log("🌐 Internet available. Syncing to Atlas...");

    const atlasDB = await connectAtlas();

    const AtlasProduct = atlasDB.model("Product", Product.schema);
    const AtlasBill = atlasDB.model("Bill", Bill.schema);

    const unsyncedProducts = await Product.find({ synced: false });
    const unsyncedBills = await Bill.find({ synced: false });

    for (const product of unsyncedProducts) {
      const exists = await AtlasProduct.findOne({ name: product.name });
      if (exists) {
        exists.quantity = product.quantity;
        await exists.save();
      } else {
        await new AtlasProduct(product.toObject()).save();
      }
      product.synced = true;
      await product.save();
    }

    for (const bill of unsyncedBills) {
      await new AtlasBill(bill.toObject()).save();
      bill.synced = true;
      await bill.save();
    }

    console.log("✅ Sync complete");
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
  }
}

module.exports = syncToAtlas;
