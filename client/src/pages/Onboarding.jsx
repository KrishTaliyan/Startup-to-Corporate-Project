import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect Logic
  const handleContinue = () => {
    if (user?.role === 'corporate') {
        navigate("/corporate");
    } else if (user?.role === 'admin') {
        navigate("/admin");
    } else {
        navigate("/dashboard");
    }
  };

  if (!user) return null;

  const isStartup = user.role === 'startup';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      
      {/* Background Glow Effect */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 pointer-events-none ${isStartup ? 'bg-indigo-600' : 'bg-cyan-600'}`}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          Welcome to <br />
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isStartup ? 'from-indigo-400 to-purple-500' : 'from-cyan-400 to-blue-500'}`}>
            CONNECTX
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          {isStartup 
            ? "Your startup journey begins here. We have successfully connected your profile to our global network of investors and corporate partners." 
            : "Welcome, Partner. Your corporate portal is ready. Start discovering high-growth startups and innovation opportunities curated for your industry."}
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[1,2,3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="text-3xl mb-2">{isStartup ? (i===1 ? "🚀" : i===2 ? "🤝" : "💰") : (i===1 ? "🔍" : i===2 ? "📊" : "⚡")}</div>
                    <div className="text-white font-bold text-lg mb-1">{isStartup ? (i===1 ? "Launch Profile" : i===2 ? "Connect" : "Raise Funds") : (i===1 ? "Scout Talent" : i===2 ? "Analyze Data" : "Innovate")}</div>
                    <div className="text-slate-500 text-sm">
                        {isStartup 
                            ? (i===1 ? "Setup your company identity." : i===2 ? "Network with industry leaders." : "Access exclusive grants.")
                            : (i===1 ? "Find the best startups." : i===2 ? "Track market trends." : "Deploy pilot programs.")}
                    </div>
                </div>
            ))}
        </div>

        <button 
          onClick={handleContinue}
          className={`px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-transform hover:scale-105 ${isStartup ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20'}`}
        >
          {isStartup ? "Launch Dashboard 🚀" : "Enter Portal 🏢"}
        </button>

      </motion.div>
    </div>
  );
}