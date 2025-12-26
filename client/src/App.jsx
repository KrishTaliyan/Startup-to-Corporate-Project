import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";

// Import Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";

// --- DASHBOARDS ---
import StartupDashboard from "./pages/StartupDashboard"; // Empty (New User)
import StartupDashboardActive from "./pages/StartupDashboardActive"; // Active (Old User)
import CorporateDashboard from "./pages/CorporateDashboard"; // Empty (New User)
import CorporateDashboardActive from "./pages/CorporateDashboardActive"; // Active (Old User) - ⭐ NEW IMPORT
import AdminDashboard from "./pages/AdminDashboard";

import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Events from "./pages/Events";
import Community from "./pages/Community";

// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Loading State
  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">Loading System...</div>;
  
  // 2. Not Logged In -> Go to Login
  if (!user) return <Navigate to="/login" replace />;
  
  // 3. Role Check
  if (allowedRoles) {
      const userRole = user.role ? user.role.toLowerCase() : "";
      
      if (!allowedRoles.includes(userRole)) {
          // Redirect based on role if they are in the wrong place
          if (userRole === 'admin') return <Navigate to="/admin" replace />;
          // ⭐ FIX: Send Old Corporate users to their Active Dashboard if they get lost
          if (userRole === 'corporate') return <Navigate to="/corporate-active" replace />;
          // ⭐ FIX: Send Old Startup users to their Active Dashboard
          return <Navigate to="/dashboard-active" replace />;
      }
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ⭐ ONBOARDING ROUTE */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />

          {/* --- STARTUP ROUTES --- */}
          
          {/* 1. Empty Dashboard (Post-Onboarding / New User) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <StartupDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 2. Active Dashboard (Returning / Old User) */}
          <Route 
            path="/dashboard-active" 
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <StartupDashboardActive />
              </ProtectedRoute>
            } 
          />

          {/* --- CORPORATE ROUTES --- */}

          {/* 1. Empty Dashboard (Post-Onboarding / New User) */}
          <Route 
            path="/corporate" 
            element={
              <ProtectedRoute allowedRoles={['corporate']}>
                <CorporateDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 2. Active Dashboard (Returning / Old User) - ⭐ NEW ROUTE */}
          <Route 
            path="/corporate-active" 
            element={
              <ProtectedRoute allowedRoles={['corporate']}>
                <CorporateDashboardActive />
              </ProtectedRoute>
            } 
          />

          {/* ADMIN ROUTE */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
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