import React from "react";
import InventoryList from "../components/InventoryList";
import { useNavigate } from "react-router-dom";

const InventoryPage = ({ inventory, updateProduct, deleteProduct }) => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Inventory List</h1>
      <InventoryList
        inventory={inventory}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
      />
      <button onClick={() => navigate("/")} className="back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default InventoryPage;
