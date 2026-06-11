import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaKey,
  FaShieldAlt,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);
    navigate("/login");
  };

  const handleNav = () => {
    setOpen(false);
  };

  const menuClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition font-medium ${
      location.pathname === path
        ? "bg-[#E3FCF7] text-[#00684A]"
        : "text-[#001E2B] hover:bg-[#F0F4F5] hover:text-[#00684A]"
    }`;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E8ECEF] z-50 transform transition-transform duration-300 shadow-sm
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo */}
      <div className="p-5 border-b border-[#E8ECEF]">
        <h1 className="text-3xl font-bold text-[#00684A] mb-8">
          SecurePass Vault
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Password Vault
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex flex-col gap-2">

        <Link
          to="/dashboard"
          onClick={handleNav}
          className={menuClass("/dashboard")}
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/add"
          onClick={handleNav}
          className={menuClass("/add")}
        >
          <FaPlusCircle />
          Add Credential
        </Link>

        <Link
          to="/generator"
          onClick={handleNav}
          className={menuClass("/generator")}
        >
          <FaKey />
          Password Generator
        </Link>

        <Link
          to="/personalized"
          onClick={handleNav}
          className={menuClass("/personalized")}
        >
          <FaKey />
          Personalized Generator
        </Link>

        <Link
          to="/strength"
          onClick={handleNav}
          className={menuClass("/strength")}
        >
          <FaShieldAlt />
          Strength Checker
        </Link>

        <Link
          to="/audit-logs"
          onClick={handleNav}
          className={menuClass("/audit-logs")}
        >
          <FaHistory />
          Activity Logs
        </Link>

        <Link
          to="/settings"
          onClick={handleNav}
          className={menuClass("/settings")}
        >
          <FaCog />
          Settings
        </Link>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

      </nav>
    </div>
  );
};

export default Sidebar;