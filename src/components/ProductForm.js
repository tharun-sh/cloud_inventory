import React, { useState } from "react";

const ProductForm = ({ addProduct }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || !price || !quantity) {
      alert("Please fill all fields");
      return;
    }
    const product = {
      name: productName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };
    addProduct(product);
    setProductName("");
    setPrice("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label>Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
