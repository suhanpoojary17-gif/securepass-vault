import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCredential = () => {
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!platform || !username || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/vault/add", {
        platform,
        accountUsername: username,
        encryptedPassword: password,
        notes: "",
      });

      toast.success("Credential added successfully");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add credential"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg w-96"
      >
        <h2 className="text-white text-xl mb-4">
          Add Credential
        </h2>

        <input
          type="text"
          placeholder="Platform (e.g. Instagram)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-800 text-white rounded"
        />

        <input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-800 text-white rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Saving..." : "Save Credential"}
        </button>
      </form>
    </div>
  );
};

export default AddCredential;