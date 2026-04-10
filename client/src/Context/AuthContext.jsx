import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [globalMandates, setGlobalMandates] = useState(() => {
    const saved = localStorage.getItem("cx_global_mandates");
    return saved ? JSON.parse(saved) : [
      { id: 1, corporateName: "Global Tech Corp", title: "Seeking AI Security Pilot", sector: "Cybersecurity", budget: "$100k", timestamp: "2024-12-20" }
    ];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("cx_user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { localStorage.removeItem("cx_user"); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("cx_global_mandates", JSON.stringify(globalMandates));
  }, [globalMandates]);

  const addMandate = (postData) => {
    const newPost = { ...postData, id: Date.now(), applicants: 0, timestamp: new Date().toLocaleDateString() };
    setGlobalMandates((prev) => [newPost, ...prev]);
  };

  // ⭐ FIX: Accept 'selectedRole' so backend/offline logic knows what UI toggled
  const login = async (email, password, selectedRole) => {
    setLoading(true); 

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Send role to backend just in case
            body: JSON.stringify({ email, password, role: selectedRole }),
        });

        const data = await response.json();

        if (response.ok) {
            handleLoginSuccess(data.user);
            return { success: true, role: data.user.role };
        } else {
            setLoading(false);
            return { success: false, message: data.message };
        }
    } catch (error) {
        // Pass selectedRole to offline login
        return performOfflineLogin(email, selectedRole);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userData),
        });
        const data = await response.json();

        if (response.ok) {
            handleLoginSuccess(data.user);
            return { success: true, role: data.user.role };
        } else {
            if (response.status === 404) return login(userData.email, userData.password, userData.role);
            setLoading(false);
            return { success: false, message: data.message || "Registration failed" };
        }
    } catch (error) {
        return performOfflineLogin(userData.email, userData.role);
    }
  };

  // ⭐ FIX: Honor the role selected by the user in offline mode
  const performOfflineLogin = async (email, selectedRole) => {
        // If UI role is provided, use it. Otherwise fallback to email check.
        const mockRole = selectedRole ? selectedRole.toLowerCase() : ((email.includes("admin") || email.includes("corp")) ? "corporate" : "startup");
        const namePart = email.split("@")[0];
        
        const offlineUser = {
            id: Date.now(),
            name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
            email: email,
            role: mockRole,
            companyName: mockRole === 'corporate' ? "Offline Corp" : "Offline Startup",
            isOffline: true 
        };

        await new Promise(r => setTimeout(r, 500)); 
        handleLoginSuccess(offlineUser);
        return { success: true, role: mockRole };
  };

  const handleLoginSuccess = (userData) => {
      if (userData.role) { userData.role = userData.role.toLowerCase(); }
      localStorage.setItem("cx_user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false); 
  };

  const logout = () => {
    localStorage.removeItem("cx_user");
    setUser(null);
    window.location.href = "/"; 
  };

  const updateUser = (newData) => {
      const updated = { ...user, ...newData };
      setUser(updated);
      localStorage.setItem("cx_user", JSON.stringify(updated));
  };

  const value = { user, login, logout, register, updateUser, loading, globalMandates, addMandate };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}