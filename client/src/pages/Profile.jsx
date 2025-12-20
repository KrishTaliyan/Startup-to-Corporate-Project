import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.companyName || "",
    industry: user?.industry || "",
    website: user?.website || "",
    bio: user?.bio || "",
    location: user?.location || "San Francisco, CA"
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:5000/api/auth/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert("✅ Profile Updated Successfully!");
      setIsEditing(false);
      window.location.reload(); // Refresh to show new data
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-300 font-sans">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#15161b] px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-white text-xl tracking-tight">Connect<span className="text-indigo-500">X</span></div>
        <Link to="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white">← Back to Dashboard</Link>
      </nav>

      {/* HEADER BANNER */}
      <div className="h-48 bg-gradient-to-r from-indigo-900 to-black border-b border-white/10 relative">
        <div className="absolute -bottom-12 left-8 md:left-20 flex items-end gap-6">
          <div className="w-24 h-24 bg-[#1f2937] rounded-2xl border-4 border-[#0B0C10] flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
             {formData.companyName ? formData.companyName[0] : "U"}
          </div>
          <div className="mb-3">
             <h1 className="text-3xl font-bold text-white">{formData.companyName}</h1>
             <div className="text-indigo-400 font-bold text-sm uppercase tracking-wider">{user?.role} Account</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: CONTACT INFO */}
        <div className="space-y-6">
           <div className="bg-[#15161b] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4">Contact Details</h3>
              <div className="space-y-4 text-sm">
                 <div>
                    <div className="text-slate-500 text-xs uppercase font-bold">Email</div>
                    <div className="text-white">{user?.email}</div>
                 </div>
                 <div>
                    <div className="text-slate-500 text-xs uppercase font-bold">Website</div>
                    {isEditing ? (
                      <input name="website" value={formData.website} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white mt-1" placeholder="https://" />
                    ) : (
                      <a href={formData.website} target="_blank" className="text-indigo-400 hover:underline truncate block">{formData.website || "Not added"}</a>
                    )}
                 </div>
                 <div>
                    <div className="text-slate-500 text-xs uppercase font-bold">Location</div>
                    {isEditing ? (
                      <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white mt-1" />
                    ) : (
                      <div className="text-white">{formData.location}</div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: MAIN CONTENT */}
        <div className="md:col-span-2 space-y-8">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Company Overview</h2>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${isEditing ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
           </div>

           <div className="bg-[#15161b] p-8 rounded-2xl border border-white/5">
              <div className="mb-6">
                 <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Company Bio / Thesis</label>
                 {isEditing ? (
                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white leading-relaxed focus:border-indigo-500 outline-none" placeholder="Tell us about your innovation goals..." />
                 ) : (
                    <p className="text-slate-300 leading-relaxed">{formData.bio || "No bio added yet. Click edit to add your company description."}</p>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Industry Sector</label>
                    {isEditing ? (
                       <input name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" />
                    ) : (
                       <div className="bg-white/5 px-4 py-3 rounded-lg text-white font-bold">{formData.industry || "Unassigned"}</div>
                    )}
                 </div>
                 <div>
                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">{user?.role === 'startup' ? 'Funding Stage' : 'Department'}</label>
                    <div className="bg-white/5 px-4 py-3 rounded-lg text-white font-bold opacity-60 cursor-not-allowed">
                       {user?.role === 'startup' ? (user?.fundingStage || "Seed") : (user?.department || "Innovation")}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}