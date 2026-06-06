import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audit-logs");
        setLogs(res.data.logs);
      } catch (err) {
        toast.error("Failed to load logs");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log._id} className="bg-gray-800 p-3 rounded">
            <p className="font-semibold">{log.action}</p>
            <p className="text-gray-400">{log.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;