import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/authContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleLogout = () => {
    // clear stored user and update context
    localStorage.removeItem("userId");
    if (setCurrentUser) setCurrentUser(null);
    // navigate to login
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      {/* ...existing dashboard content... */}
    </div>
  );
};

export default Dashboard;
