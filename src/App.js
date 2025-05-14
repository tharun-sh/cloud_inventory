import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InventoryPage from "./pages/InventoryPage";
import CreateBill from "./pages/CreateBill";
import BillHistory from "./pages/BillHistory";
import Taskbar from "./components/Taskbar";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [inventory, setInventory] = useState([]);
  const [bills, setBills] = useState([]);

  const API_BASE = "http://localhost:5000/api";

  // ⬇️ Fetch initial data on app load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, billRes] = await Promise.all([
          axios.get(`${API_BASE}/inventory`),
          axios.get(`${API_BASE}/bills`),
        ]);
        setInventory(invRes.data);
        setBills(billRes.data);
      } catch (err) {
        console.error("Failed to fetch data from server:", err.message);
      }
    };
    fetchData();
  }, []);

  // ➕ Add product
  const addProduct = async (product) => {
    try {
      const res = await axios.post(`${API_BASE}/inventory`, product);
      setInventory([...inventory, res.data]);
    } catch (err) {
      console.error("Failed to add product:", err.message);
    }
  };

  // ✏️ Update product
  const updateProduct = async (updatedProduct) => {
    try {
      const product = inventory.find(
        (item) => item.name === updatedProduct.originalName
      );

      if (!product) return;

      const res = await axios.put(`${API_BASE}/inventory/${product._id}`, {
        name: updatedProduct.name,
        quantity: updatedProduct.quantity,
      });

      setInventory((prev) =>
        prev.map((item) => (item._id === product._id ? res.data : item))
      );
    } catch (err) {
      console.error("Failed to update product:", err.message);
    }
  };

  // ❌ Delete product
  const deleteProduct = async (productName) => {
    try {
      const product = inventory.find((item) => item.name === productName);
      if (!product) return;

      await axios.delete(`${API_BASE}/inventory/${product._id}`);

      setInventory((prev) => prev.filter((item) => item._id !== product._id));
    } catch (err) {
      console.error("Failed to delete product:", err.message);
    }
  };

  // 🧾 Add bill
  const addBill = async (bill) => {
    try {
      const res = await axios.post(`${API_BASE}/bills`, bill);
      setBills([...bills, res.data]);

      // Update inventory
      const updatedInventory = inventory
        .map((item) => {
          if (item.name.toLowerCase() === bill.productName.toLowerCase()) {
            return {
              ...item,
              quantity: item.quantity - bill.quantity,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      setInventory(updatedInventory);

      // Update product in DB
      const productToUpdate = inventory.find(
        (p) => p.name === bill.productName
      );
      if (productToUpdate) {
        await axios.put(`${API_BASE}/inventory/${productToUpdate._id}`, {
          name: productToUpdate.name,
          quantity: productToUpdate.quantity - bill.quantity,
        });
      }
    } catch (err) {
      console.error("Failed to add bill:", err.message);
    }
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
