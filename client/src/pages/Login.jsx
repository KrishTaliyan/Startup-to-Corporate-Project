import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [role, setRole] = useState("startup"); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            // ⭐ LOGIC: Where do they go?
            
            // 1. If New User -> Onboarding
            if (result.isNewUser) {
                navigate("/onboarding");
                return;
            }

            // 2. If Returning User -> Check Role
            // Normalize role to lowercase to prevent errors
            let targetRole = (result.role || role).toLowerCase();
            
            if (targetRole === 'corporate') {
                // ⭐ FIX: Send Old Corporate users to the Active Dashboard
                navigate("/corporate-active");
            } else if (targetRole === 'admin') {
                navigate("/admin");
            } else {
                // ⭐ STARTUP: Go to Active Dashboard (Charts & Data)
                navigate("/dashboard-active"); 
            }
        } else {
            setError(result.message || "Invalid credentials.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        setError("System error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // Dynamic Theme Colors
  const isStartup = role === "startup";
  const theme = isStartup 
    ? { 
        gradient: "from-indigo-600 to-violet-600", 
        glow: "shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]",
        border: "focus:border-indigo-500",
        text: "text-indigo-400",
        bg: "bg-indigo-600",
        label: "Founder Access"
      }
    : { 
        gradient: "from-cyan-600 to-teal-600", 
        glow: "shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]",
        border: "focus:border-cyan-500",
        text: "text-cyan-400",
        bg: "bg-cyan-600",
        label: "Partner Portal"
      };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300 selection:bg-indigo-500 selection:text-white">
      
      {/* 🌌 HI-TECH BACKGROUND GRID */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${isStartup ? 'bg-indigo-600' : 'bg-cyan-600'}`}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-2xl mb-4 bg-gradient-to-br ${theme.gradient} ring-1 ring-white/20`}>
             {/* Changed L to I */}
             I
           </div>
           <h1 className="text-3xl font-black text-white tracking-tighter">
             {/* Changed LETSCONNECT to INNOBRIDGE */}
             INNO<span className={`transition-colors duration-500 ${theme.text}`}>BRIDGE</span>
           </h1>
           <p className="text-slate-500 text-sm font-medium tracking-widest uppercase mt-1">
             {theme.label}
           </p>
        </div>

        <div className="bg-[#0F111A]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Top Line Glow */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient}`}></div>

          {/* 🔘 ROLE TOGGLE */}
          <div className="bg-[#050505] p-1 rounded-xl flex mb-8 border border-white/10 relative">
              <motion.div 
                className={`absolute top-1 bottom-1 rounded-lg bg-gradient-to-r ${theme.gradient} shadow-lg`}
                layoutId="slider"
                initial={false}
                animate={{
                  left: isStartup ? '4px' : '50%',
                  width: 'calc(50% - 4px)',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              
              <button onClick={() => setRole("startup")} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider relative z-10 transition-colors ${isStartup ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                Startup
              </button>
              <button onClick={() => setRole("corporate")} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider relative z-10 transition-colors ${!isStartup ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                Corporate
              </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                 <label className="text-[10px] font-bold uppercase text-slate-500 mb-1.5 block tracking-widest">Email Address</label>
                 <input 
                   type="email" 
                   name="email" 
                   required 
                   onChange={handleChange}
                   className={`w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-opacity-100 focus:ring-0 ${theme.border}`}
                   placeholder={isStartup ? "founder@startup.com" : "admin@company.com"} 
                 />
              </div>
              
              <div>
                 <label className="text-[10px] font-bold uppercase text-slate-500 mb-1.5 block tracking-widest">Password</label>
                 <input 
                   type="password" 
                   name="password" 
                   required 
                   onChange={handleChange}
                   className={`w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-opacity-100 focus:ring-0 ${theme.border}`}
                   placeholder="••••••••" 
                 />
              </div>

              <div className="flex justify-between items-center text-xs">
                 <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-colors">
                    <input type="checkbox" className={`rounded bg-white/5 border-white/10 ${theme.text} focus:ring-0`} />
                    Remember me
                 </label>
                 <Link to="#" className="text-slate-500 hover:text-white transition-colors">Forgot password?</Link>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm uppercase tracking-widest shadow-lg ${theme.glow} bg-gradient-to-r ${theme.gradient} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Authenticating...
                  </span>
                ) : "Access Dashboard"}
              </motion.button>
          </form>
        </div>
        
        <div className="text-center mt-8 text-slate-600 text-xs">
           <span className="opacity-50">Secure Connection 256-bit SSL</span>
        </div>
      </motion.div>
    </div>
  );
}