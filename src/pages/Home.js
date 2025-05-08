import React from "react";
import ProductForm from "../components/ProductForm";

const Home = ({ addProduct }) => {
  return (
    <div className="page-container">
      <h1>Inventory Management</h1>
      <ProductForm addProduct={addProduct} />
    </div>
  );
};

export default Home;
