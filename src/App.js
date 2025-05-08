import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InventoryPage from "./pages/InventoryPage";
import CreateBill from "./pages/CreateBill";
import BillHistory from "./pages/BillHistory";
import Taskbar from "./components/Taskbar";
import { useState } from "react";
import "./App.css";

function App() {
  const [inventory, setInventory] = useState([]);
  const [bills, setBills] = useState([]);

  const addProduct = (product) => {
    setInventory([...inventory, product]);
  };

  const updateProduct = (updatedProduct) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.name === updatedProduct.originalName
          ? { name: updatedProduct.name, quantity: updatedProduct.quantity }
          : item
      )
    );
  };

  const deleteProduct = (productName) => {
    setInventory((prevInventory) =>
      prevInventory.filter((item) => item.name !== productName)
    );
  };

  const addBill = (bill) => {
    const { productName, quantity } = bill;

    const productIndex = inventory.findIndex(
      (item) =>
        item.name.toLowerCase().trim() === productName.toLowerCase().trim()
    );

    if (productIndex !== -1) {
      const updatedInventory = [...inventory];

      updatedInventory[productIndex].quantity -= quantity;

      if (updatedInventory[productIndex].quantity <= 0) {
        updatedInventory.splice(productIndex, 1);
      }

      setInventory(updatedInventory);
    }

    setBills([...bills, bill]);
  };

  return (
    <div>
      <Taskbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home addProduct={addProduct} />} />
          <Route
            path="/inventory"
            element={
              <InventoryPage
                inventory={inventory}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />
            }
          />
          <Route
            path="/create-bill"
            element={<CreateBill inventory={inventory} addBill={addBill} />}
          />
          <Route path="/bill-history" element={<BillHistory bills={bills} />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
