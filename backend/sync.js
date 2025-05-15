const Product = require("./models/Product");
const dotenv = require("dotenv");
const Bill = require("./models/Bill");
const mongoose = require("mongoose");

dotenv.config();
const atlasUri = process.env.ATLAS_MONGO_URI;

let atlasConnection = null;
async function connectAtlas() {
  try {
    if (!atlasConnection) {
      atlasConnection = await mongoose.createConnection(atlasUri, {
        dbName: "cloudInventory",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    if (atlasConnection && atlasConnection.readyState === 0) {
      atlasConnection = await mongoose.createConnection(atlasUri, {
        dbName: "cloudInventory",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    console.log("🌐 Internet available. Syncing to Atlas...");
  } catch (error) {
    console.error("❌ Atlas MongoDB connection failed:", error.message);
    atlasConnection = null;
  }

  return atlasConnection;
}

async function syncToAtlas() {
  try {
    const atlasDB = await connectAtlas();

    if (!atlasDB) {
      return;
    }

    const AtlasProduct = atlasDB.model("Product", Product.schema);

    const AtlasBill = atlasDB.model("Bill", Bill.schema);

    const unsyncedProducts = await Product.find({ synced: false });

    const unsyncedBills = await Bill.find({ synced: false });

    for (const product of unsyncedProducts) {
      const exists = await AtlasProduct.findOne({ name: product.name });

      product.synced = true;
      if (exists) {
        exists.quantity = product.quantity;
        await exists.save();
      } else {
        await new AtlasProduct(product.toObject()).save();
      }

      await product.save();
    }

    for (const bill of unsyncedBills) {
      bill.synced = true;
      await new AtlasBill(bill.toObject()).save();

      await bill.save();
    }

    console.log("✅ Sync complete");
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
  }
}

module.exports = syncToAtlas;
