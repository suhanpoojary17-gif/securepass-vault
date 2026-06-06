import { useState } from "react";
import api from "../services/api";

const PersonalizedGenerator = () => {
  const [keyword, setKeyword] = useState("");
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");

  const generate = async () => {
    const res = await api.post("/password/personalized", {
      keyword,
      length,
    });

    setPassword(res.data.password);
  };

  return (
    <div className="p-6 flex justify-center">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Personalized Password Generator
        </h2>

        {/* KEYWORD INPUT */}
        <input
          placeholder="Enter keyword"
          className="w-full p-2 rounded text-black mb-3"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {/* LENGTH INPUT */}
        <input
          type="number"
          placeholder="Length"
          className="w-full p-2 rounded text-black mb-3"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={generate}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Generate Password
        </button>

        {/* OUTPUT */}
        {password && (
          <div className="mt-4 bg-gray-700 p-3 rounded break-all">
            {password}
          </div>
        )}

      </div>
    </div>
  );
};

export default PersonalizedGenerator;