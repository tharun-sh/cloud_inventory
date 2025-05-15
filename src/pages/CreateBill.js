import { useState, useEffect } from "react";

const CreateBill = ({ inventory, addBill }) => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const product = inventory.find(
      (item) =>
        item.name.toLowerCase().trim() === productName.toLowerCase().trim()
    );

    if (product && quantity !== "") {
      const qty = parseInt(quantity);
      if (!isNaN(qty) && qty >= 0) {
        setTotalPrice(product.price * qty);
        setError("");
      } else {
        setTotalPrice(0);
        setError("");
      }
    } else if (productName.trim() !== "" && quantity !== "") {
      // 👉 Only show error when BOTH product and quantity are filled
      setError("Product not found in inventory!");
      setTotalPrice(0);
    } else {
      setError("");
      setTotalPrice(0);
    }
  }, [productName, quantity, inventory]);

  const handleCreateBill = () => {
    if (!productName || !quantity) {
      alert("Please fill all fields.");
      return;
    }

    const product = inventory.find(
      (item) =>
        item.name.toLowerCase().trim() === productName.toLowerCase().trim()
    );

    if (!product) {
      alert("Product not found in inventory!");
      return;
    }

    const finalPrice = product.price * parseInt(quantity);

    addBill({
      productName: product.name,
      quantity: parseInt(quantity),
      price: finalPrice,
    });

    alert("Bill created successfully!");
    setProductName("");
    setQuantity("");
    setTotalPrice(0);
    setError("");
  };

  return (
    <div className="page-container">
      <h1>Create Bill</h1>
      <div className="form-container">
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter Product Name"
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter Quantity"
            min="0"
          />
        </div>

        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

        <h3>Total Price: ₹ {totalPrice}</h3>
        <button onClick={handleCreateBill}>Create Bill</button>
      </div>
    </div>
  );
};

export default CreateBill;
