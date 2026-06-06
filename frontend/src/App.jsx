import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddCredential from "./pages/AddCredential";
import Verification from "./pages/Verification";
import Settings from "./pages/Settings";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

import PasswordGenerator from "./pages/PasswordGenerator";
import PersonalizedGenerator from "./pages/PersonalizedGenerator";
import StrengthChecker from "./pages/StrengthChecker";
import ExpiryChecker from "./pages/ExpiryChecker";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="w-full">

        {/* Top bar */}
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
        </div>

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />

          <Route
            path="/add"
            element={<ProtectedRoute><AddCredential /></ProtectedRoute>}
          />

          <Route
            path="/verify"
            element={<ProtectedRoute><Verification /></ProtectedRoute>}
          />

          <Route
            path="/settings"
            element={<ProtectedRoute><Settings /></ProtectedRoute>}
          />

          <Route
            path="/audit-logs"
            element={<ProtectedRoute><AuditLogs /></ProtectedRoute>}
          />

          {/* Tools */}
          <Route
            path="/generator"
            element={<ProtectedRoute><PasswordGenerator /></ProtectedRoute>}
          />

          <Route
            path="/personalized"
            element={<ProtectedRoute><PersonalizedGenerator /></ProtectedRoute>}
          />

          <Route
            path="/strength"
            element={<ProtectedRoute><StrengthChecker /></ProtectedRoute>}
          />

          <Route
            path="/expiry"
            element={<ProtectedRoute><ExpiryChecker /></ProtectedRoute>}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;