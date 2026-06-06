import { useState } from "react";
import api from "../services/api";

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");

  const generate = async () => {
    try {
      const res = await api.get(
        `/password/generate?length=${length}`
      );
      setPassword(res.data.password);
    } catch (error) {
      console.error("Error generating password:", error);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Random Password Generator
        </h2>

        <input
          type="number"
          className="w-full p-2 rounded text-black"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={6}
          max={64}
        />

        <button
          onClick={generate}
          className="mt-3 w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Generate
        </button>

        {password && (
          <div className="mt-4 bg-gray-700 p-3 rounded break-all">
            {password}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;