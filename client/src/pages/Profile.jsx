import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

// Simple SVG Icons components to avoid external dependencies
const IconBriefcase = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;

export default function Profile() {
  // 1. Destructure updateUser from useAuth
  const { user, updateUser } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Local state for form
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    bio: "",
    location: ""
  });

  // Load user data into state when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || "",
        industry: user.industry || "",
        website: user.website || "",
        bio: user.bio || "",
        location: user.location || "San Francisco, CA"
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        // 2. Use updateUser to update the app state instantly
        updateUser(formData); 
        alert("✅ Profile Updated Successfully!");
        setIsEditing(false);
      } else {
        alert("❌ Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-white text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg"></div>
          Connect<span className="text-indigo-500">X</span>
        </div>
        
        <div className="flex items-center gap-6">
            {/* 3. NEW: Admin Panel Link (Only shows if you are an Admin) */}
            {user?.role === 'admin' && (
                <Link to="/admin" className="text-red-500 font-bold text-sm hover:text-red-400 transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Admin Panel
                </Link>
            )}

            <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            ← Back to Dashboard
            </Link>
        </div>
      </nav>

      {/* HEADER BANNER */}
      <div className="h-64 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-[#0f172a] to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="max-w-6xl mx-auto px-8 h-full flex items-end pb-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-8 w-full">
            
            {/* Avatar / Logo */}
            <div className="w-32 h-32 bg-[#18181b] rounded-2xl border-4 border-[#09090b] flex items-center justify-center shadow-2xl relative -mb-16 md:mb-0">
               <span className="text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500">
                 {formData.companyName ? formData.companyName[0].toUpperCase() : "U"}
               </span>
            </div>

            {/* Name & Role */}
            <div className="mb-2 flex-1">
               <h1 className="text-4xl font-extrabold text-white tracking-tight">
                 {formData.companyName || "Company Name"}
               </h1>
               <div className="flex items-center gap-3 mt-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user?.role === 'startup' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                   {user?.role || "User"} Account
                 </span>
                 {user?.location && (
                   <span className="flex items-center gap-1 text-slate-400 text-sm">
                     <IconMapPin /> {formData.location}
                   </span>
                 )}
               </div>
            </div>

            {/* Edit Actions */}
            <div className="mb-2">
               <button 
                disabled={loading}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center gap-2 ${
                  isEditing 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' 
                  : 'bg-white text-black hover:bg-slate-200'
                }`}
              >
                {loading ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-6xl mx-auto mt-16 px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        
        {/* LEFT COLUMN: CONTACT DETAILS */}
        <div className="space-y-6">
           <div className="bg-[#18181b]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-xl">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                About
              </h3>
              
              <div className="space-y-6">
                 {/* Email Item */}
                 <div className="group">
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-2">
                      <IconMail /> Email
                    </div>
                    <div className="text-slate-200 font-medium truncate">{user?.email}</div>
                 </div>

                 {/* Website Item */}
                 <div className="group">
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-2">
                      <IconGlobe /> Website
                    </div>
                    {isEditing ? (
                      <input 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600" 
                        placeholder="https://example.com" 
                      />
                    ) : (
                      <a href={formData.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline truncate block transition-colors">
                        {formData.website || "Add website"}
                      </a>
                    )}
                 </div>

                 {/* Location Item */}
                 <div className="group">
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-2">
                      <IconMapPin /> Location
                    </div>
                    {isEditing ? (
                      <input 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                      />
                    ) : (
                      <div className="text-slate-200">{formData.location}</div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: MAIN INFO */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Bio Section */}
           <div className="bg-[#18181b]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-xl">
              <div className="mb-6">
                 <label className="text-slate-500 text-xs font-bold uppercase mb-3 block flex items-center gap-2">
                   Company Bio / Thesis
                 </label>
                 {isEditing ? (
                    <textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange} 
                      className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-slate-200 leading-relaxed focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-slate-600" 
                      placeholder="Tell us about your innovation goals, technology stack, or what you are looking for..." 
                    />
                 ) : (
                    <p className="text-slate-300 leading-relaxed text-lg font-light">
                      {formData.bio || "No bio added yet. Click edit to add your company description."}
                    </p>
                 )}
              </div>
           </div>

           {/* Details Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Industry Card */}
              <div className="bg-[#18181b]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-xl">
                 <label className="text-slate-500 text-xs font-bold uppercase mb-3 block flex items-center gap-2">
                   <IconBriefcase /> Industry Sector
                 </label>
                 {isEditing ? (
                    <input 
                      name="industry" 
                      value={formData.industry} 
                      onChange={handleChange} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                    />
                 ) : (
                    <div className="text-white font-medium text-lg">{formData.industry || "Unassigned"}</div>
                 )}
              </div>

              {/* Status Card (Read Only) */}
              <div className="bg-[#18181b]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-10">
                    <IconBriefcase />
                 </div>
                 <label className="text-slate-500 text-xs font-bold uppercase mb-3 block">
                   {user?.role === 'startup' ? 'Funding Stage' : 'Department'}
                 </label>
                 <div className="text-white/50 font-medium text-lg cursor-not-allowed select-none">
                    {user?.role === 'startup' ? (user?.fundingStage || "Seed") : (user?.department || "Innovation")}
                 </div>
                 <div className="text-xs text-slate-600 mt-2">Cannot be changed</div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}