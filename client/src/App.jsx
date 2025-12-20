import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";

// Import Pages
// NOTE: Make sure all these files inside pages folder are named .jsx (e.g., Home.jsx)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartupDashboard from "./pages/StartupDashboard";
import CorporateDashboard from "./pages/CorporateDashboard";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Events from "./pages/Events";
import Community from "./pages/Community";

// Protected Route Logic
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
     // Redirect to the correct dashboard based on role
     return <Navigate to={user.role === 'startup' ? '/dashboard' : '/corporate'} />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Startup Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <StartupDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Corporate Routes */}
          <Route 
            path="/corporate" 
            element={
              <ProtectedRoute allowedRoles={['corporate']}>
                <CorporateDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Shared Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}