import { useNavigate } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear storage (IMPORTANT)
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you store user

    // 2. Close sidebar
    setOpen(false);

    // 3. Redirect to login
    navigate("/login");
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

        <a href="/dashboard" onClick={() => setOpen(false)}>
          Dashboard
        </a>

        <a href="/add" onClick={() => setOpen(false)}>
          Add Credential
        </a>

        <a href="/settings" onClick={() => setOpen(false)}>
          Settings
        </a>

        <a href="/audit-logs" onClick={() => setOpen(false)}>
          Activity
        </a>

        {/*  LOGOUT BUTTON */}
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