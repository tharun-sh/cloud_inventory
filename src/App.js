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
      const res = await axios.put(
        `http://localhost:5000/api/inventory/${updatedProduct.name}`,
        {
          name: updatedProduct.name,
          quantity: updatedProduct.quantity,
          price: updatedProduct.price,
        }
      );

      // Update local state with backend response
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item._id === updatedProduct._id ? res.data : item
        )
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

      await axios.delete(`${API_BASE}/inventory/${productName}`);

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
