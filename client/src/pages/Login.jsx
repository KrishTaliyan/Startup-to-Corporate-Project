import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid credentials");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#0B0C10] text-slate-300 font-sans">
      
      {/* LEFT SIDE: Brand / Visual */}
      <div className="relative hidden md:flex flex-col justify-center px-16 bg-[#0E0F14] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic text-xl shadow-lg shadow-indigo-600/20">C</div>
            <span className="text-2xl font-bold text-white tracking-tight">Connect<span className="text-indigo-500">X</span></span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            The Operating System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Corporate Innovation.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md leading-relaxed">
            Securely access your deal flow, manage pilots, and track innovation metrics from one terminal.
          </p>

          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">$2.4B</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Deal Flow</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex items-center justify-center p-8 bg-[#0B0C10]">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-500">Enter your enterprise credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Work Email</label>
              <input
                type="email"
                required
                className="w-full bg-[#15161b] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#15161b] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-0" />
                <span className="text-slate-400">Remember device</span>
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Authenticating..." : "Initialize Session"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 font-bold hover:text-white transition-colors">
              Apply for Access
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}