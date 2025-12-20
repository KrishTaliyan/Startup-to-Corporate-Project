import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("startup"); // Default role
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", companyName: "",
    industry: "", fundingStage: "", // Startup fields
    department: "", pilotBudget: "" // Corporate fields
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send data + role to backend
    const result = await register({ ...formData, role });
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1f2937] p-8 rounded-2xl border border-white/10 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Join ConnectX</h2>
        <p className="text-slate-400 text-center mb-6">Choose your account type</p>

        {/* ROLE TOGGLE SWITCH */}
        <div className="flex bg-black/40 p-1 rounded-lg mb-6">
          <button 
            type="button"
            onClick={() => setRole("startup")}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${role === 'startup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            🚀 Startup Founder
          </button>
          <button 
            type="button"
            onClick={() => setRole("corporate")}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${role === 'corporate' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            🏢 Corporate Exec
          </button>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" onChange={handleChange} placeholder="Full Name" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none" />
          <input name="email" type="email" onChange={handleChange} placeholder="Work Email" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none" />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none" />

          {/* DYNAMIC FIELDS BASED ON ROLE */}
          {role === "startup" ? (
            <>
              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-2">Startup Details</div>
              <input name="companyName" onChange={handleChange} placeholder="Startup Name" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input name="industry" onChange={handleChange} placeholder="Industry (e.g. Fintech)" className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white" />
                <select name="fundingStage" onChange={handleChange} className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-slate-300">
                  <option value="">Stage...</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-2">Corporate Details</div>
              <input name="companyName" onChange={handleChange} placeholder="Company Name (e.g. Microsoft)" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input name="department" onChange={handleChange} placeholder="Department" className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white" />
                <select name="pilotBudget" onChange={handleChange} className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-slate-300">
                  <option value="">Budget...</option>
                  <option value="$10k-50k">$10k - $50k</option>
                  <option value="$50k-100k">$50k - $100k</option>
                  <option value="$100k+">$100k+</option>
                </select>
              </div>
            </>
          )}

          <button className={`w-full py-3 rounded-lg text-white font-bold mt-4 ${role === 'startup' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
            {role === 'startup' ? 'Launch Startup Profile' : 'Access Corporate Portal'}
          </button>
        </form>
        <div className="mt-6 text-center text-slate-500 text-sm">
           Already have an account? <Link to="/login" className="text-white hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}