import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// allowedRoles is optional. If not passed, it just checks if user is logged in.
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  // 1. Loading State (Prevents premature redirect)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="text-slate-500 font-mono text-xs tracking-widest animate-pulse">
          VERIFYING CREDENTIALS...
        </div>
      </div>
    );
  }

  // 2. Not Logged In -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in, but wrong Role -> Show Access Denied
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Restricted Area</h1>
        <p className="text-slate-500 text-sm max-w-md text-center mb-8">
          Your clearance level ({user.role.toUpperCase()}) does not grant access to this secure terminal.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          Return to Previous Session
        </button>
      </div>
    );
  }

  // 4. Authorized
  return children;
}