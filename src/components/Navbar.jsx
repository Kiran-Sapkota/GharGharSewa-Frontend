import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-700">
        GharGhar Sewa
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="text-gray-700">Home</Link>

        {authUser && authUser.role === "user" && (
          <>
            <Link to="/search" className="text-gray-700">Search</Link>
            <Link to="/chatbot" className="text-gray-700">Chatbot</Link>
            <Link to="/bookings" className="text-gray-700">Bookings</Link>
          </>
        )}

        {authUser && authUser.role === "provider" && (
          <Link to="/provider-dashboard" className="text-gray-700">
            Provider Dashboard
          </Link>
        )}

        {authUser && authUser.role === "admin" && (
          <Link to="/admin-dashboard" className="text-gray-700">
            Admin Dashboard
          </Link>
        )}

        {!authUser ? (
          <>
            <Link to="/login" className="text-gray-700">Login</Link>
            <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-gray-700 font-medium">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;