import { useState } from "react";

const ProductList = ({ inventory, updateProduct, deleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (item) => {
    setEditingItem(item._id); // use _id for unique key
    setEditedName(item.name);
    setEditedQuantity(item.quantity);
    setEditedPrice(item.price);
  };

  const handleSaveClick = (productId) => {
    updateProduct({
      _id: productId,
      name: editedName,
      quantity: parseInt(editedQuantity),
      price: parseFloat(editedPrice),
    });
    setEditingItem(null);
  };

  const handleDeleteClick = (productName) => {
    deleteProduct(productName);
  };

  return (
    <div className="product-list-container">
      <h2>List of Products</h2>

      <div className="search-container">
        <label>Search: </label>
        <input
          type="text"
          placeholder="Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item, index) => (
            <tr key={item._id}>
              <td>{String(index + 1).padStart(5, "0")}</td>

              <td>
                {editingItem === item._id ? (
                  <input
                    className="product-update"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>

              <td>
                {editingItem === item._id ? (
                  <input
                    className="quantity-update"
                    type="number"
                    value={editedQuantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                  />
                ) : (
                  item.quantity
                )}
              </td>

              <td>
                {editingItem === item._id ? (
                  <input
                    className="price-update"
                    type="number"
                    step="0.01"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                ) : (
                  `₹${item.price}`
                )}
              </td>

              <td>
                <div className="action-buttons">
                  {editingItem === item._id ? (
                    <button
                      className="save-button"
                      onClick={() => handleSaveClick(item._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="update-button"
                        onClick={() => handleEditClick(item)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteClick(item.name)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
