const BillHistory = ({ bills }) => {
  return (
    <div className="page-container">
      <h1>Bill History</h1>
      {bills.length === 0 ? (
        <p>No bills created yet.</p>
      ) : (
        <ul>
          {bills.map((bill, index) => (
            <li key={index}>
              {bill.productName} | Quantity: {bill.quantity} | Total: ₹{" "}
              {bill.totalPrice}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BillHistory;
