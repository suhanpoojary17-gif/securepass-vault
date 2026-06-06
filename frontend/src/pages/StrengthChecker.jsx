import { useState } from "react";
import api from "../services/api";

const StrengthChecker = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);

  const check = async () => {
    const res = await api.post("/password/strength", {
      password,
    });

    setResult(res.data);
  };

  return (
    <div className="p-6 flex justify-center">

      {/* CARD */}
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Password Strength Checker
        </h2>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter password"
          className="w-full p-2 rounded text-black mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={check}
          className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Check Strength
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-4 bg-gray-700 p-3 rounded space-y-1">
            <p>
              <span className="font-semibold">Strength:</span>{" "}
              {result.strength}
            </p>
            <p>
              <span className="font-semibold">Score:</span>{" "}
              {result.score}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default StrengthChecker;