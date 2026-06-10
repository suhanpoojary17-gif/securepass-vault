import { useEffect, useState } from "react";
import { getCredentials } from "../services/api";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // VIEW MODAL
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // EDIT MODAL
  const [editData, setEditData] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);

  // DELETE
  const [deleteId, setDeleteId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  
  //EXPIRY CHECKER
  const [expiryInfo, setExpiryInfo] = useState(null);
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  //OTP FOR EDIT & DELETE
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingData, setPendingData] = useState(null);

  const navigate = useNavigate();

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await getCredentials();
      setData(res.data.credentials || []);
    } catch {
      toast.error("Failed to load vault data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // COPY
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  //otp for edit, delete
  const requestOtpForEdit = async (item) => {
  try {
    await api.post("/otp/send", {
      purpose: "EDIT_CREDENTIAL",
      credentialId: item._id,
    });

    setPendingAction("EDIT");
    setPendingData(item);
    setOtpSent(true);

    toast.success("OTP sent");
  } catch (error) {
    toast.error(error.response?.data?.message || "OTP failed");
  }
};

const requestOtpForDelete = async (id) => {
  try {
    await api.post("/otp/send", {
      purpose: "DELETE_CREDENTIAL",
      credentialId: id,
    });

    setPendingAction("DELETE");
    setPendingData(id);
    setOtpSent(true);

    toast.success("OTP sent");
  } catch (error) {
    toast.error(error.response?.data?.message || "OTP failed");
  }
};

  // SEND OTP
  const handleSendOtp = async (id) => {
    if (otpLoading || otpCooldown) return;

    try {
      setOtpLoading(true);

      await api.post("/otp/send", {
        purpose: "VIEW_CREDENTIAL",
        credentialId: id,
      });

      setPendingId(id);
      setPendingAction(null);
      setOtpSent(true);

      setOtpCooldown(true);
      setTimeout(() => setOtpCooldown(false), 15000);

      toast.success("OTP sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP failed");
    } finally {
      setOtpLoading(false);
    }
  };

  // VERIFY OTP
const handleVerifyOtp = async () => {
  try {
    await api.post("/otp/verify", { otp });

    if (pendingAction === null) {
      const res = await api.get(`/vault/view/${pendingId}`);

      setSelectedCredential(
        res.data.credential || res.data
      );

      setShowModal(true);
      toast.success("Password retrieved");
    } else if (pendingAction === "EDIT") {
      handleEdit(pendingData);
      toast.success("OTP verified");
    } else if (pendingAction === "DELETE") {
      setDeleteId(pendingData);
      setShowDelete(true);
      toast.success("OTP verified");
    }

    setOtp("");
    setOtpSent(false);
    setPendingAction(null);
    setPendingData(null);
    setPendingId(null);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Invalid OTP"
    );
  }
};

  // DELETE FLOW
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/vault/${deleteId}`);

      toast.success("Deleted successfully");

      setData((prev) => prev.filter((item) => item._id !== deleteId));

      setShowDelete(false);
      setDeleteId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setEditData({
      ...item,
      password: "",
    });
    setShowEdit(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const payload = {
        platform: editData.platform,
        accountUsername: editData.accountUsername,
        password: editData.password,
        notes: editData.notes || "",
      };

      await api.put(`/vault/${editData._id}`, payload);

      toast.success("Updated");

      setShowEdit(false);
      setEditData(null);
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  // CHECK PASSWORD EXPIRY
  const handleCheckExpiry = async (id) => {
    try {
      const res = await api.get(`/password/expiry/${id}`);

      setExpiryInfo(res.data);
      setShowExpiryModal(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to check expiry"
      );
    }
  };

  // CLOSE MODALS
  const closeModal = () => {
    setSelectedCredential(null);
    setShowModal(false);
  };

  const closeEditModal = () => {
    setEditData(null);
    setShowEdit(false);
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
            className="bg-gray-900 p-4 rounded-xl hover:scale-[1.02] transition"
          >
            <h2 className="text-xl font-semibold">{item.platform}</h2>

            <p className="text-gray-300">👤 {item.accountUsername}</p>

            <div className="flex gap-2 mt-3 flex-wrap">

              <button
                onClick={() => handleCopy(item.accountUsername)}
                className="bg-green-500 px-2 py-1 rounded"
              >
                Copy
              </button>

            <button
              disabled={otpLoading || otpCooldown}
              onClick={() => handleSendOtp(item._id)}
              className="bg-yellow-500 px-2 py-1 rounded disabled:opacity-50"
            >
              {otpCooldown ? "Wait..." : "View Password"}
            </button>

            <button
              onClick={() => handleCheckExpiry(item._id)}
              className="bg-purple-500 px-2 py-1 rounded"
            >
              Check Expiry
            </button>

            <button
              onClick={() => requestOtpForEdit(item)}
              className="bg-blue-500 px-2 py-1 rounded"
            >
              Edit
            </button>

              <button
                onClick={() => requestOtpForDelete(item._id)}
                className="bg-red-500 px-2 py-1 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {showModal && selectedCredential && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded w-96 text-center">

            <h2 className="text-xl mb-2">
              🔐 {selectedCredential?.platform}
            </h2>

            <p className="bg-gray-800 p-3 break-all">
              {selectedCredential?.password}
            </p>

            <div className="flex gap-2 justify-center mt-3">

              <button
                onClick={() => handleCopy(selectedCredential?.password)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Copy
              </button>

              <button
                onClick={closeModal}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">

          <div className="bg-gray-900 p-6 w-96 rounded">

            <h2 className="text-xl mb-3 text-center">
              Edit Credential
            </h2>

            <input
              value={editData.platform || ""}
              onChange={(e) =>
                setEditData({ ...editData, platform: e.target.value })
              }
              className="w-full p-2 mb-2 bg-gray-800"
            />

            <input
              value={editData.accountUsername || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  accountUsername: e.target.value,
                })
              }
              className="w-full p-2 mb-2 bg-gray-800"
            />

            <input
              value={editData.password || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  password: e.target.value,
                })
              }
              placeholder="New Password"
              className="w-full p-2 mb-4 bg-gray-800"
            />

            <div className="flex gap-2 justify-center">

              <button
                onClick={handleUpdate}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Save
              </button>

              <button
                onClick={closeEditModal}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* OTP MODAL */}
      {otpSent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 w-80 text-center">

            <h2 className="text-xl mb-3">Enter OTP</h2>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-3 bg-gray-800"
            />

            <div className="flex gap-2 justify-center">

              <button
                onClick={handleVerifyOtp}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Verify
              </button>

              <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setPendingAction(null);
                setPendingData(null);
                setPendingId(null);
              }}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Cancel
            </button>

            </div>

          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-80 text-center">

            <h2 className="text-xl mb-4">Delete this credential?</h2>

            <div className="flex gap-2 justify-center">

              <button
                onClick={handleDelete}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDelete(false)}
                className="bg-gray-500 px-3 py-1 rounded"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* EXPIRY MODAL */}
      {showExpiryModal && expiryInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 text-center border border-gray-700">

            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Password Status
            </h2>

            <div className="space-y-3">

              <p className="text-lg">
                🌐 Platform:
                <span className="font-semibold ml-2">
                  {expiryInfo.platform}
                </span>
              </p>

              <p className="text-lg text-yellow-400">
                ⏳ Age: {expiryInfo.passwordAge}
              </p>

              <p
                className={`text-lg font-semibold ${
                  expiryInfo.recommendation
                    .toLowerCase()
                    .includes("fresh")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {expiryInfo.recommendation}
              </p>

            </div>

            <button
              onClick={() => {
                setShowExpiryModal(false);
                setExpiryInfo(null);
              }}
              className="mt-6 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;