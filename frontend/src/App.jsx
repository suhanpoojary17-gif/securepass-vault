import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCredential from "./pages/AddCredential";
import Verification from "./pages/Verification";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddCredential />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;