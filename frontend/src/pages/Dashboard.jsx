import { useEffect, useState } from "react";
import { getCredentials } from "../services/api";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getCredentials();
      setData(res.data.credentials || []);
    } catch (error) {
      toast.error("Failed to load vault data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // ✅ FIXED: FETCH PASSWORD FROM BACKEND
  const handleViewPassword = async (id) => {
    try {
      const res = await api.get(`/vault/view/${id}`);
      setSelectedCredential(res.data);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to fetch password");
    }
  };

  const closeModal = () => {
    setSelectedCredential(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">
        Loading Vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔐 My Vault</h1>

        <button
          onClick={() => navigate("/add")}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Credential
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 p-4 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">
              {item.platform}
            </h2>

            <p className="text-gray-300 mb-1">
              👤 {item.accountUsername}
            </p>

            <p className="text-gray-400 mb-3">
              🔑 •••••••••
            </p>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  handleCopy(item.accountUsername)
                }
                className="bg-green-500 px-3 py-1 rounded text-sm"
              >
                Copy Username
              </button>

              <button
                onClick={() => handleViewPassword(item._id)}
                className="bg-yellow-500 px-3 py-1 rounded text-sm"
              >
                View Password
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && selectedCredential && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">

          <div className="bg-gray-900 p-6 rounded-lg w-96 text-center">

            <h2 className="text-xl mb-2 font-bold">
              🔐 {selectedCredential.platform}
            </h2>

            <p className="text-gray-300 mb-2">
              👤 {selectedCredential.accountUsername}
            </p>

            <p className="bg-gray-800 p-3 rounded mb-4 break-all">
              {selectedCredential.password}
            </p>

            <div className="flex gap-2 justify-center">

              <button
                onClick={() =>
                  handleCopy(selectedCredential.password)
                }
                className="bg-green-500 px-4 py-2 rounded"
              >
                Copy
              </button>

              <button
                onClick={closeModal}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Close
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;