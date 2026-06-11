import { useEffect, useState } from "react";
import { getCredentials } from "../services/api";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

//UI imporvement
import Layout from "../components/Layout";

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
  <Layout className="min-h-screen bg-[#F9FBFA] text-[#001E2B] p-6">
  {/* HEADER */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-[#001E2B]">🔐 My Vault</h1>

    <button
      onClick={() => navigate("/add")}
      className="bg-[#00ED64] text-[#001E2B] font-medium px-4 py-2 rounded-lg hover:bg-[#00D45A] transition"
    >
      + Add Credential
    </button>
  </div>

  {/* GRID */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.map((item) => (
      <div
        key={item._id}
        className="bg-white border border-[#E8ECEF] shadow-sm p-4 rounded-xl hover:shadow-md hover:scale-[1.02] transition"
      >
        <h2 className="text-xl font-semibold text-[#001E2B]">{item.platform}</h2>

        <p className="text-gray-600 mt-1">
          👤 {item.accountUsername}
        </p>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => handleCopy(item.accountUsername)}
            className="bg-[#00ED64] text-[#001E2B] px-3 py-1 rounded-lg hover:bg-[#00D45A] transition"
          >
            Copy
          </button>

          <button
            disabled={otpLoading || otpCooldown}
            onClick={() => handleSendOtp(item._id)}
            className="bg-amber-400 text-[#001E2B] px-3 py-1 rounded-lg hover:bg-amber-500 disabled:opacity-50 transition"
          >
            {otpCooldown ? "Wait..." : "View Password"}
          </button>

          <button
            onClick={() => handleCheckExpiry(item._id)}
            className="bg-violet-500 text-white px-3 py-1 rounded-lg hover:bg-violet-600 transition"
          >
            Check Expiry
          </button>

          <button
            onClick={() => requestOtpForEdit(item)}
            className="bg-[#00ED64] text-[#001E2B] px-3 py-1 rounded-lg hover:bg-[#00D45A] transition"
          >
            Edit
          </button>

          <button
            onClick={() => requestOtpForDelete(item._id)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* VIEW MODAL */}
  {showModal && selectedCredential && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl border border-[#E8ECEF] p-6 rounded-xl w-96 text-center">
        <h2 className="text-xl font-semibold mb-3">
          🔐 {selectedCredential?.platform}
        </h2>

        <p className="bg-[#F5F7F8] p-3 rounded-lg break-all">
          {selectedCredential?.password}
        </p>

        <div className="flex gap-2 justify-center mt-4">
          <button
            onClick={() => handleCopy(selectedCredential?.password)}
            className="bg-[#00ED64] text-[#001E2B] px-3 py-1 rounded-lg hover:bg-[#00D45A]"
          >
            Copy
          </button>

          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}

  {/* EDIT MODAL */}
  {showEdit && editData && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-white shadow-xl border border-[#E8ECEF] p-6 w-96 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Edit Credential
        </h2>

        <input
          value={editData.platform || ""}
          onChange={(e) =>
            setEditData({ ...editData, platform: e.target.value })
          }
          className="w-full p-2 mb-3 border border-[#E8ECEF] rounded-lg bg-white"
        />

        <input
          value={editData.accountUsername || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              accountUsername: e.target.value,
            })
          }
          className="w-full p-2 mb-3 border border-[#E8ECEF] rounded-lg bg-white"
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
          className="w-full p-2 mb-4 border border-[#E8ECEF] rounded-lg bg-white"
        />

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleUpdate}
            className="bg-[#00ED64] text-[#001E2B] px-4 py-2 rounded-lg hover:bg-[#00D45A]"
          >
            Save
          </button>

          <button
            onClick={closeEditModal}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  {/* OTP MODAL */}
  {otpSent && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-white shadow-xl border border-[#E8ECEF] p-6 w-80 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-3">
          Enter OTP
        </h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border border-[#E8ECEF] rounded-lg bg-white"
        />

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleVerifyOtp}
            className="bg-[#00ED64] text-[#001E2B] px-4 py-2 rounded-lg hover:bg-[#00D45A]"
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
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  {/* DELETE MODAL */}
  {showDelete && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-white shadow-xl border border-[#E8ECEF] p-6 rounded-xl w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Delete this credential?
        </h2>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={() => setShowDelete(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  {/* EXPIRY MODAL */}
  {showExpiryModal && expiryInfo && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl border border-[#E8ECEF] p-6 rounded-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#001E2B]">
          Password Status
        </h2>

        <div className="space-y-3">
          <p className="text-lg">
            🌐 Platform:
            <span className="font-semibold ml-2">
              {expiryInfo.platform}
            </span>
          </p>

          <p className="text-lg text-gray-600">
            ⏳ Age: {expiryInfo.passwordAge}
          </p>

          <p
            className={`text-lg font-semibold ${
              expiryInfo.recommendation
                .toLowerCase()
                .includes("fresh")
                ? "text-green-500"
                : "text-red-500"
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
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  )}
</Layout>
  );
};

export default Dashboard;