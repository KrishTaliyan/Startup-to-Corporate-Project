import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// --- ICONS ---
const ICONS = {
    Home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Download: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Close: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    Settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    User: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
};

// --- MOCK DATA ---
const MOCK_STARTUPS = [
    { 
        id: 1, name: "Nebula AI", industry: "Artificial Intelligence", stage: "Seed", 
        ask: "$2.5M", equity: "10%", valuation: "$25M",
        logo: "N", color: "from-indigo-500 to-purple-600",
        desc: "Generative AI for enterprise supply chain optimization. Reduces logistics costs by 30%.",
        revenue: [10, 25, 45, 80, 120, 180], 
        team: "Ex-Google DeepMind", runway: "18 Months"
    },
    { 
        id: 2, name: "GreenVolt", industry: "CleanTech", stage: "Series A", 
        ask: "$8M", equity: "12%", valuation: "$65M",
        logo: "G", color: "from-emerald-500 to-green-600",
        desc: "Next-gen solid-state batteries for EV manufacturers. 2x range, 50% faster charging.",
        revenue: [50, 80, 120, 200, 350, 600],
        team: "PhD Stanford Physics", runway: "24 Months"
    },
    { 
        id: 3, name: "FinMesh", industry: "Fintech", stage: "Pre-Seed", 
        ask: "$750k", equity: "8%", valuation: "$9M",
        logo: "F", color: "from-blue-500 to-cyan-500",
        desc: "Decentralized payment rails for cross-border B2B transactions. Instant settlement.",
        revenue: [2, 5, 8, 15, 22, 35],
        team: "Y Combinator Alumni", runway: "12 Months"
    },
    { 
        id: 4, name: "MediCore", industry: "HealthTech", stage: "Series B", 
        ask: "$15M", equity: "N/A", valuation: "$120M",
        logo: "M", color: "from-rose-500 to-red-600",
        desc: "AI-driven robotic surgery assistant. FDA approved for cardiac procedures.",
        revenue: [200, 400, 800, 1200, 1800, 2500],
        team: "Ex-Johnson & Johnson", runway: "30 Months"
    },
];

export default function CorporateDashboard() {
  const { user, logout, updateUser } = useAuth();
  
  // State
  const [view, setView] = useState("Scout"); // Default to scouting for new users
  const [filter, setFilter] = useState("All");
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ 
      name: user?.name || "", 
      companyName: user?.companyName || "", 
      title: "Investment Manager", 
      email: user?.email || "" 
  });

  if(!user) return <div className="h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;

  const filteredStartups = filter === "All" 
    ? MOCK_STARTUPS 
    : MOCK_STARTUPS.filter(s => s.industry.includes(filter) || (filter === 'High Value' && s.ask.includes('M')));

  const showToast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateProfile = (e) => {
      e.preventDefault();
      updateUser(formData);
      showToast("Profile Updated Successfully");
  };

  const handleSaveSettings = () => showToast("Settings Configuration Saved");
  const handleDownload = () => showToast("Downloading Pitch Deck...");
  const handleMeeting = () => showToast("Meeting Request Sent!");

  return (
    <div className="flex h-screen bg-[#050505] font-sans text-slate-300 overflow-hidden selection:bg-cyan-500 selection:text-white">
        
        {toast && <div className="fixed top-6 right-6 px-6 py-3 bg-cyan-600 text-white rounded-xl shadow-xl z-50 font-bold animate-bounce flex items-center gap-2">
            <span className="text-xl">✅</span> {toast}
        </div>}

        {/* SIDEBAR */}
        <aside className="w-72 bg-[#0F111A]/90 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
            <div className="h-24 flex items-center px-8 border-b border-white/5 bg-[#020617]">
                <div className="text-xl font-black text-white tracking-tighter">CONNECT<span className="text-cyan-500">X</span></div>
            </div>
            
            <div className="flex-1 py-8 px-4 space-y-2">
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Discovery</div>
                 <button onClick={() => setView("Scout")} className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Scout" ? "bg-cyan-600/10 text-white border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                    {ICONS.Search} Scout Startups
                 </button>
                 
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">Account</div>
                 <button onClick={() => setView("Profile")} className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Profile" ? "bg-cyan-600/10 text-white border border-cyan-500/50" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                    {ICONS.User} Profile
                 </button>
                 <button onClick={() => setView("Settings")} className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Settings" ? "bg-cyan-600/10 text-white border border-cyan-500/50" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                    {ICONS.Settings} Settings
                 </button>
            </div>

            <div className="p-6 border-t border-white/5 mt-auto bg-[#0A0C12]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">{user.name[0]}</div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-cyan-400 truncate tracking-wide">Corporate Account</div>
                    </div>
                </div>
                <button onClick={logout} className="w-full py-2.5 border border-white/10 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">SECURE LOGOUT</button>
            </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 overflow-y-auto relative bg-[#050505]">
            
            {/* TOP TICKER */}
            <div className="h-10 bg-[#020617] border-b border-white/5 flex items-center overflow-hidden sticky top-0 z-30 backdrop-blur-md">
                <div className="text-[10px] font-bold text-cyan-500 uppercase px-6 whitespace-nowrap flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live Market
                </div>
                <div className="text-[10px] font-mono text-slate-400 animate-marquee whitespace-nowrap flex gap-12">
                    <span>🚀 AI Sector Deal Flow ↑ 15%</span>
                    <span>💰 TechStars Demo Day: Applications Open</span>
                    <span>⚡ CleanTech valuations stabilizing at 12x ARR</span>
                    <span>📉 Late-stage funding rounds oversubscribed</span>
                </div>
            </div>

            <div className="p-10 pb-32 max-w-7xl mx-auto">
                
                {/* 1. SCOUT / DISCOVERY VIEW */}
                {view === "Scout" && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
                        <header className="mb-10">
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Innovation Discovery</h1>
                            <p className="text-slate-400 max-w-2xl">Access curated deal flow from the world's top accelerators. Filter by funding stage, industry, and ask.</p>
                        </header>

                        {/* FILTERS */}
                        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            {["All", "Artificial Intelligence", "Fintech", "CleanTech", "High Value"].map(t => (
                                <button key={t} onClick={() => setFilter(t)} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filter === t ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/20" : "bg-[#151B2B] text-slate-400 border-white/10 hover:border-white/30 hover:text-white"}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* STARTUP GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredStartups.map(s => (
                                <div key={s.id} onClick={() => setSelectedStartup(s)} className="bg-[#0F111A] border border-white/5 rounded-3xl p-6 hover:border-cyan-500/50 hover:bg-[#151B2B] transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>{s.logo}</div>
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-wide">{s.stage}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{s.name}</h3>
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-4 tracking-wider">{s.industry}</div>
                                    
                                    <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-3 flex-grow">{s.desc}</p>

                                    <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                                        <div><div className="text-[10px] text-slate-500 uppercase font-bold">Funding Ask</div><div className="text-white font-bold text-lg">{s.ask}</div></div>
                                        <div className="text-right"><div className="text-[10px] text-slate-500 uppercase font-bold">Equity</div><div className="text-cyan-400 font-bold text-lg">{s.equity}</div></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 2. PROFILE VIEW */}
                {view === "Profile" && (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="max-w-3xl">
                        <header className="mb-10 border-b border-white/10 pb-6">
                            <h1 className="text-3xl font-bold text-white">Corporate Profile</h1>
                            <p className="text-slate-400 mt-2">Manage your public investment profile and team details.</p>
                        </header>

                        <div className="bg-[#0F111A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                        <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                                        <input value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Corporate Entity</label>
                                    <input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Investment Thesis</label>
                                    <textarea className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none" placeholder="Describe your investment focus (e.g., Early-stage AI, Series B Fintech)..."></textarea>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5">Save Profile Changes</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* 3. SETTINGS VIEW */}
                {view === "Settings" && (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="max-w-3xl">
                        <header className="mb-10 border-b border-white/10 pb-6">
                            <h1 className="text-3xl font-bold text-white">System Settings</h1>
                            <p className="text-slate-400 mt-2">Configure security, notifications, and API access.</p>
                        </header>

                        <div className="space-y-6">
                            {/* Notification Settings */}
                            <div className="bg-[#0F111A] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">{ICONS.Bell}</div>
                                    <div>
                                        <div className="text-white font-bold">Deal Flow Alerts</div>
                                        <div className="text-xs text-slate-500">Receive emails for high-match startups.</div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>

                            {/* Security Settings */}
                            <div className="bg-[#0F111A] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">{ICONS.Shield}</div>
                                    <div>
                                        <div className="text-white font-bold">Two-Factor Authentication</div>
                                        <div className="text-xs text-slate-500">Secure your account with 2FA.</div>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Enable</button>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button onClick={handleSaveSettings} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">Save Preferences</button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>

            {/* ⭐ DETAILED DOSSIER MODAL */}
            <AnimatePresence>
                {selectedStartup && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0F111A] border border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className={`h-40 bg-gradient-to-r ${selectedStartup.color} relative shrink-0`}>
                                <button onClick={() => setSelectedStartup(null)} className="absolute top-6 right-6 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition-colors">{ICONS.Close}</button>
                                <div className="absolute -bottom-10 left-10 w-24 h-24 bg-[#0F111A] rounded-2xl p-1 shadow-2xl">
                                    <div className="w-full h-full bg-[#1A1E29] rounded-xl flex items-center justify-center text-4xl font-bold text-white">
                                        {selectedStartup.logo}
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 pt-16 overflow-y-auto scrollbar-hide">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-4xl font-black text-white mb-2">{selectedStartup.name}</h2>
                                        <div className="flex gap-3">
                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-slate-300 border border-white/5">{selectedStartup.industry}</span>
                                            <span className="px-3 py-1 bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold">{selectedStartup.stage} Round</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-3 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">
                                            {ICONS.Download} Deck
                                        </button>
                                        <button onClick={handleMeeting} className="px-6 py-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-cyan-500 hover:text-white transition-all shadow-lg">
                                            Schedule Call
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8 mb-8">
                                    <div className="col-span-2 space-y-8">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Executive Summary</h4>
                                            <p className="text-slate-300 leading-relaxed text-sm">{selectedStartup.desc} Built by a team with background from {selectedStartup.team}, they are currently scaling operations.</p>
                                        </div>
                                        
                                        {/* Fake Revenue Chart */}
                                        <div className="bg-[#151B2B] p-6 rounded-2xl border border-white/5">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-xs font-bold text-white uppercase">Growth Trajectory (Projected)</h4>
                                                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">↑ 240% YoY</span>
                                            </div>
                                            <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={selectedStartup.revenue.map((v, i) => ({ name: `Q${i+1}`, v }))}>
                                                        <defs><linearGradient id="colorG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                                        <XAxis dataKey="name" hide />
                                                        <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" opacity={0.3} />
                                                        <Tooltip contentStyle={{backgroundColor: '#0F111A', borderColor: '#334155', color: '#fff'}} itemStyle={{color: '#06b6d4'}} />
                                                        <Area type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={3} fill="url(#colorG)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-[#151B2B] p-5 rounded-2xl border border-white/5">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Investment Ask</div>
                                            <div className="text-3xl font-black text-white">{selectedStartup.ask}</div>
                                            <div className="text-xs text-cyan-400 mt-1 font-bold">for {selectedStartup.equity} Equity</div>
                                        </div>
                                        <div className="bg-[#151B2B] p-5 rounded-2xl border border-white/5">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Valuation Cap</div>
                                            <div className="text-2xl font-bold text-white">{selectedStartup.valuation}</div>
                                        </div>
                                        <div className="bg-[#151B2B] p-5 rounded-2xl border border-white/5">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Runway</div>
                                            <div className="text-2xl font-bold text-white">{selectedStartup.runway}</div>
                                        </div>
                                        <div className="bg-[#151B2B] p-5 rounded-2xl border border-white/5">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Founding Team</div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                {ICONS.Users} {selectedStartup.team}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </main>
    </div>
  );
}