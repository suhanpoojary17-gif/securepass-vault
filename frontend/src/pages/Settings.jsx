import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-6">⚙️ Settings</h1>

      <div className="bg-gray-900 p-6 rounded w-96">
        <input
          placeholder="Old Password"
          type="password"
          className="w-full p-2 mb-3 bg-gray-800"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          placeholder="New Password"
          type="password"
          className="w-full p-2 mb-3 bg-gray-800"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          className="bg-blue-500 px-4 py-2 rounded w-full"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Settings;