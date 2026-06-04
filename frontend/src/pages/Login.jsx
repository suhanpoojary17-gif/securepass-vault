import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🔍 DEBUG: check what you're sending
      console.log("Sending login request:", {
        email,
        password,
      });

      const res = await loginUser({
        email,
        masterPassword: password
      });

console.log("LOGIN RESPONSE FULL:", res);
console.log("LOGIN RESPONSE DATA:", res.data);

      //console.log("Login response:", res.data);

      // Save JWT token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      } else {
        toast.error("Token not received from backend");
        return;
      }

      toast.success("Login successful 🚀");

      navigate("/dashboard");
    } catch (error) {
      console.log("Login error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-6 rounded-lg w-96 shadow-lg"
      >
        <h2 className="text-white text-2xl mb-5 text-center">
          SecurePass Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;