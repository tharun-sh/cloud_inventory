import { useState } from "react";

const ProductList = ({ inventory, updateProduct, deleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (item) => {
    setEditingItem(item.name);
    setEditedName(item.name);
    setEditedQuantity(item.quantity);
  };

  const handleSaveClick = (originalName) => {
    updateProduct({
      originalName: originalName,
      name: editedName,
      quantity: parseInt(editedQuantity),
    });
    setEditingItem(null);
  };

  const handleDeleteClick = (productName) => {
    deleteProduct(productName);
  };

  return (
    <div className="product-list-container">
      <h2>List of Products</h2>

      {/* Search Box */}
      <div className="search-container">
        <label>Search: </label>
        <input
          type="text"
          placeholder="Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Product Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item, index) => (
            <tr key={index}>
              <td>{String(index + 1).padStart(5, "0")}</td>

              {/* Editable fields if editing */}

              <td>
                {editingItem === item.name ? (
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
                {editingItem === item.name ? (
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
                <div className="action-buttons">
                  {editingItem === item.name ? (
                    <button
                      className="save-button"
                      onClick={() => handleSaveClick(item.name)}
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
