import { useState } from "react";
import api from "../services/api";

const ExpiryChecker = () => {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);

  const checkExpiry = async () => {
    const res = await api.get(`/password/expiry/${id}`);
    setResult(res.data);
  };

  return (
    <div className="p-6 flex justify-center">

      {/* CARD */}
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Password Expiry Checker
        </h2>

        {/* INPUT */}
        <input
          className="w-full p-2 rounded text-black mb-3"
          placeholder="Enter Credential ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={checkExpiry}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Check Expiry
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-4 bg-gray-700 p-3 rounded space-y-1">
            <p>
              <span className="font-semibold">Platform:</span>{" "}
              {result.platform}
            </p>

            <p>
              <span className="font-semibold">Age:</span>{" "}
              {result.passwordAge}
            </p>

            <p className="mt-2 font-medium text-yellow-300">
              {result.recommendation}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpiryChecker;