import { Link } from "react-router-dom";
import "./Taskbar.css";

const Taskbar = () => {
  return (
    <div className="taskbar">
      <Link to="/">Add Product</Link>
      <Link to="/inventory">View Inventory</Link>
      <Link to="/create-bill">Create Bill</Link>
      <Link to="/bill-history">Bill History</Link>
    </div>
  );
};

export default Taskbar;
