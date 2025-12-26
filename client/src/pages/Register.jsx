import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [role, setRole] = useState("startup"); // 'startup' or 'corporate'
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", companyName: "",
    industry: "", fundingStage: "", // Startup fields
    department: "", pilotBudget: "" // Corporate fields
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const result = await register({ ...formData, role });
        
        if (result.success) {
            // ⭐ FIX: Redirect ALL new registrations to Onboarding
            console.log("Registration Success! Going to Onboarding...");
            navigate("/onboarding"); 
        } else {
            setError(result.message || "Registration failed.");
        }
    } catch (err) {
        console.error("Register Error:", err);
        setError("System error.");
    } finally {
        setLoading(false);
    }
  };

  // UI Theme Logic
  const theme = role === "startup" 
    ? { 
        gradient: "from-purple-600 to-pink-600",
        border: "focus:border-purple-500",
        ring: "focus:ring-purple-500/20",
        text: "text-purple-400"
      }
    : { 
        gradient: "from-cyan-600 to-blue-600",
        border: "focus:border-cyan-500",
        ring: "focus:ring-cyan-500/20",
        text: "text-cyan-400"
      };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-300">
      
      {/* Background Blobs */}
      <motion.div 
        animate={{ background: role === 'startup' ? 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(2,6,23,0) 70%)' : 'radial-gradient(circle, rgba(8,145,178,0.15) 0%, rgba(2,6,23,0) 70%)' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
      />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
           
           {/* ⭐ UPDATED: InnoBridge Branding */}
           <div className="flex flex-col items-center justify-center mb-4">
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg mb-2 bg-gradient-to-br ${theme.gradient}`}>
                 I
               </div>
               <h1 className="text-2xl font-black text-white tracking-tighter">
                 INNO<span className={`transition-colors duration-500 ${theme.text}`}>BRIDGE</span>
               </h1>
           </div>
           
           <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
           <p className="text-slate-400 text-sm">Join the innovation ecosystem.</p>
        </div>

        <motion.div layout className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            
            {/* ROLE SLIDER */}
            <div className="bg-[#020617]/50 p-1.5 rounded-xl flex mb-8 border border-white/5 relative">
              <motion.div 
                className={`absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r ${theme.gradient} shadow-lg`}
                layoutId="slider"
                animate={{ left: role === 'startup' ? '6px' : '50%', width: 'calc(50% - 6px)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button onClick={() => setRole("startup")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${role === 'startup' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>🚀 Startup Founder</button>
              <button onClick={() => setRole("corporate")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${role === 'corporate' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>🏢 Corporate Exec</button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <input name="name" onChange={handleChange} placeholder="Full Name" required className={`w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`} />
                 <input name="email" type="email" onChange={handleChange} placeholder="Work Email" required className={`w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`} />
              </div>
              <input name="password" type="password" onChange={handleChange} placeholder="Password" required className={`w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`} />

              {/* DYNAMIC FIELDS */}
              <motion.div 
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-2 border-t border-white/5"
              >
                 <div className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>{role === 'startup' ? 'Startup Details' : 'Corporate Details'}</div>
                 
                 <input name="companyName" onChange={handleChange} placeholder={role === 'startup' ? "Startup Name" : "Company Name"} className={`w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`} />
                 
                 <div className="grid grid-cols-2 gap-4">
                   {role === 'startup' ? (
                     <>
                       <input name="industry" onChange={handleChange} placeholder="Industry" className={`bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`} />
                       <select name="fundingStage" onChange={handleChange} className={`bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-slate-300 outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`}>
                         <option value="">Stage...</option>
                         <option value="Seed">Seed</option>
                         <option value="Series A">Series A</option>
                         <option value="Series B+">Series B+</option>
                       </select>
                     </>
                   ) : (
                     <>
                       <input name="department" onChange={handleChange} placeholder="Department" className={`bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`} />
                       <select name="pilotBudget" onChange={handleChange} className={`bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-slate-300 outline-none transition-all ${theme.border} ${theme.ring} focus:ring-4`}>
                         <option value="">Budget...</option>
                         <option value="$10k-50k">$10k - $50k</option>
                         <option value="$50k-100k">$50k - $100k</option>
                         <option value="$100k+">$100k+</option>
                       </select>
                     </>
                   )}
                 </div>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold mt-4 shadow-lg bg-gradient-to-r ${theme.gradient} disabled:opacity-50`}
              >
                {loading ? 'Processing...' : (role === 'startup' ? 'Launch Startup Profile' : 'Access Corporate Portal')}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-slate-500 text-sm">
              Already have an account? <Link to="/login" className={`font-bold hover:underline ${theme.text}`}>Log in</Link>
            </div>
        </motion.div>
      </div>
    </div>
  );
}