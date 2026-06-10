import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);
    navigate("/login");
  };

  const handleNav = () => {
    setOpen(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-4 font-bold text-xl border-b border-gray-700">
        Vault
      </div>

      <nav className="p-4 flex flex-col gap-4">

        <Link to="/dashboard" onClick={handleNav}>
          Dashboard
        </Link>

        <Link to="/add" onClick={handleNav}>
          Add Credential
        </Link>

        <Link to="/generator" onClick={handleNav}>
          Password Generator
        </Link>

        <Link to="/personalized" onClick={handleNav}>
          Personalized Generator
        </Link>

        <Link to="/strength" onClick={handleNav}>
          Strength Checker
        </Link>

        <Link to="/settings" onClick={handleNav}>
          Settings
        </Link>

        <Link to="/audit-logs" onClick={handleNav}>
          Activity
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;