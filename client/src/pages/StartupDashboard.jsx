import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// --- ICONS ---
const ICONS = {
    Home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Send: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    Info: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Close: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    Broadcast: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    Cog: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Rocket: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Upload: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    User: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Lock: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
};

// --- DIRECTORY (Suggestions for New Users) ---
// Kept full so user has someone to connect with immediately
const FEATURED_DIRECTORY = [
    { _id: "static_1", name: "Google Cloud", industry: "AI & Data", logo: "G", color: "from-blue-600 to-cyan-500", match: 98, desc: "Seeking GenAI solutions for Workspace integration. Open to seed-stage startups.", tag: "Enterprise", budget: "$100k Pilot", region: "Global" },
    { _id: "static_2", name: "Tesla Energy", industry: "CleanTech", logo: "T", color: "from-red-600 to-rose-600", match: 85, desc: "Looking for battery optimization and manufacturing robotics. Hardware focus.", tag: "Active Now", budget: "$250k Pilot", region: "USA/Europe" },
    { _id: "static_3", name: "Sequoia Capital", industry: "VC Firm", logo: "S", color: "from-green-600 to-emerald-400", match: 92, desc: "Series A/B funding for high-growth SaaS platforms. Looking for technical founders.", tag: "Investor", budget: "$2M Investment", region: "Global" },
    { _id: "static_4", name: "Stripe", industry: "Fintech", logo: "S", color: "from-indigo-500 to-purple-500", match: 89, desc: "Payment infrastructure and billing automation tools. B2B focus.", tag: "B2B Focus", budget: "$50k Grant", region: "Remote" },
    { _id: "static_5", name: "BMW Group", industry: "Automotive", logo: "B", color: "from-blue-800 to-slate-800", match: 82, desc: "Next-gen cockpit UI and autonomous driving sensors.", tag: "Innovation Hub", budget: "$150k Pilot", region: "Germany" },
    { _id: "static_6", name: "Y Combinator", industry: "Accelerator", logo: "Y", color: "from-orange-500 to-orange-600", match: 95, desc: "Accepting applications for Winter 2025 batch.", tag: "Accelerator", budget: "$500k Investment", region: "Global" },
];

// --- ZERO STATE ANALYTICS ---
const ZERO_ANALYTICS = [
    {name: 'Mon', v: 0}, {name: 'Tue', v: 0}, {name: 'Wed', v: 0},
    {name: 'Thu', v: 0}, {name: 'Fri', v: 0}, {name: 'Sat', v: 0}, {name: 'Sun', v: 0},
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F111A] border border-emerald-500/20 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-widest">{label}</p>
          <p className="text-emerald-400 text-sm font-black">{`${payload[0].value} VIEWS`}</p>
        </div>
      );
    }
    return null;
};

export default function StartupDashboard() {
  const { user, logout, updateUser } = useAuth();
  
  const [view, setView] = useState("Home");
  
  // ⭐ ZERO STATE: Requests start empty for new user
  const [myRequests, setMyRequests] = useState([]); 
  
  // Directory is populated so they have suggestions
  const [directory, setDirectory] = useState(FEATURED_DIRECTORY);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  
  // ⭐ ZERO STATE: Broadcasts start empty
  const [myBroadcasts, setMyBroadcasts] = useState([]);
  const [newBroadcast, setNewBroadcast] = useState({ title: "", ask: "", desc: "" });

  // UI State
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState(null);
  const [pitch, setPitch] = useState("");
  const [toast, setToast] = useState(null);
  const [settingsTab, setSettingsTab] = useState("Profile");
  
  // Settings Form Data
  const [formData, setFormData] = useState({ 
      name: "", 
      companyName: "", 
      website: "",
      bio: "",
      email: ""
  });

  useEffect(() => {
    if (user) {
        setFormData({ 
            name: user.name || "", 
            companyName: user.companyName || "",
            email: user.email || "",
            website: "", 
            bio: ""
        });
        fetchCorporates();
        fetchRequests();
    }
  }, [user]);

  const getToken = () => localStorage.getItem("cx_token");

  // --- API CALLS ---
  const fetchCorporates = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/auth/corporates", {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await res.json();
        
        if(res.ok && Array.isArray(data)) {
            const realCorps = data.map(c => ({
                _id: c._id,
                name: c.companyName || c.name,
                industry: c.industry || "Enterprise",
                logo: c.companyName ? c.companyName[0] : "C",
                color: "from-slate-700 to-slate-600", 
                match: 75, 
                desc: c.innovationFocus || "Looking for innovation partners.",
                tag: c.department || "New Member",
                budget: c.pilotBudget || "Undisclosed",
                region: "Global"
            }));
            // Append real ones to static ones
            setDirectory([...FEATURED_DIRECTORY, ...realCorps]);
        }
    } catch(err) { console.error("Error fetching corporates", err); }
  };

  const fetchRequests = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/applications/sent", {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if(res.ok && data.length > 0) setMyRequests(data);
    } catch(err) { console.error("Error fetching requests", err); }
  };

  const showToast = (msg, type="success") => {
      setToast({msg, type});
      setTimeout(() => setToast(null), 3000);
  };

  const getStatus = (receiverId) => {
      const req = myRequests.find(r => r.receiver === receiverId);
      return req ? req.status : null;
  };

  const handleConnect = (corp) => {
      if(getStatus(corp._id)) return showToast("Request already pending", "error");
      setSelectedCorp(corp);
      setDetailsOpen(false); 
      setPitch("");
      setModalOpen(true);
  };

  const handleViewDetails = (corp) => {
      setSelectedCorp(corp);
      setDetailsOpen(true);
  };

  const handleBroadcast = (e) => {
      e.preventDefault();
      const broadcast = {
          id: Date.now(),
          ...newBroadcast,
          date: new Date().toISOString().split('T')[0]
      };
      setMyBroadcasts([broadcast, ...myBroadcasts]);
      setNewBroadcast({ title: "", ask: "", desc: "" });
      showToast("Pitch Broadcasted to Network");
  };

  const submitPitch = async () => {
      if(!pitch.trim()) return showToast("Pitch cannot be empty", "error");
      
      const mockReq = {
          _id: "temp_" + Date.now(),
          targetCompanyName: selectedCorp.name,
          message: pitch,
          status: "Sent",
          createdAt: new Date().toISOString()
      };
      setMyRequests([mockReq, ...myRequests]);
      setModalOpen(false);
      showToast("Pitch Transmitted Successfully!");

      try {
        if (!selectedCorp._id.startsWith("static")) {
            await fetch("http://localhost:5000/api/applications/send", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}` 
                },
                body: JSON.stringify({
                    receiverId: selectedCorp._id,
                    targetCompanyName: selectedCorp.name,
                    message: pitch
                })
            });
            fetchRequests(); 
        }
      } catch (err) {
        console.log("Offline mode or Server Error");
      }
  };

  const handleSaveSettings = (e) => {
      e.preventDefault();
      updateUser(formData);
      showToast("Profile Updated Successfully");
  };

  const filteredDirectory = directory.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "All" || (c.industry && c.industry.includes(filter)) || (c.tag && c.tag.includes(filter));
      return matchesSearch && matchesFilter;
  });

  if(!user) return <div className="h-screen bg-[#020203] text-emerald-500 font-mono flex items-center justify-center animate-pulse">Initializing Uplink...</div>;

  return (
    <div className="flex h-screen bg-[#020203] font-sans text-slate-300 overflow-hidden selection:bg-emerald-500 selection:text-white">
        
        {/* ANIMATED GRID BACKGROUND */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

        {toast && (
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} 
                className={`fixed top-6 right-1/2 translate-x-1/2 px-6 py-3 rounded-xl z-50 font-bold border border-white/10 backdrop-blur-md flex items-center gap-3 uppercase tracking-wider text-xs shadow-2xl ${toast.type === 'error' ? 'bg-red-900/80 text-white' : 'bg-emerald-600/90 text-white'}`}>
                {toast.msg}
            </motion.div>
        )}

        {/* SIDEBAR */}
        <aside className="w-72 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
            <div className="h-24 flex items-center px-8 border-b border-white/5 bg-gradient-to-r from-emerald-950/20 to-transparent">
                <div className="text-2xl font-black text-white tracking-tighter uppercase italic">Connect<span className="text-emerald-500">X</span></div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 scrollbar-hide">
                <div className="space-y-2">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mb-2">Platform</div>
                    {[
                        {id:"Home", icon:ICONS.Home, label:"Command Center"},
                        {id:"Directory", icon:ICONS.Globe, label:"Partner Network"},
                        {id:"Broadcast", icon:ICONS.Broadcast, label:"Post Idea"},
                        {id:"Requests", icon:ICONS.Send, label:"Transmissions", badge: myRequests.length},
                    ].map(item => (
                        <button key={item.id} onClick={() => setView(item.id)} className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all duration-300 border border-transparent ${view === item.id ? "bg-emerald-500/10 border-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "hover:bg-white/5 hover:text-white text-slate-500"}`}>
                            <span className="flex items-center gap-3">{item.icon} {item.label}</span>
                            {item.badge > 0 && <span className={`text-[9px] px-2 py-0.5 rounded font-black ${view === item.id ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>{item.badge}</span>}
                        </button>
                    ))}
                </div>
                <div className="space-y-2 pt-6">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mb-2">System</div>
                    <button onClick={() => setView("Settings")} className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all border border-transparent ${view === "Settings" ? "bg-emerald-500/10 border-emerald-500/20 text-white" : "hover:bg-white/5 hover:text-white text-slate-500"}`}>
                        <span className="flex items-center gap-3">{ICONS.Cog} Config</span>
                    </button>
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40 mt-auto backdrop-blur-md">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/50">{user.name.charAt(0)}</div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-[9px] text-emerald-500 font-black tracking-widest uppercase truncate">{user.companyName}</div>
                    </div>
                </div>
                <button onClick={logout} className="w-full py-3 border border-red-500/20 rounded-xl text-xs font-black text-red-400 hover:bg-red-500/10 hover:text-red-200 transition-all uppercase tracking-widest">Terminate</button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
            <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 sticky top-0 bg-[#020203]/80 backdrop-blur-xl z-20">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">{view === 'Home' ? 'Startup Command' : view}</h1>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                         <p className="text-[10px] text-emerald-500/60 uppercase tracking-[0.2em] font-mono">System Online</p>
                    </div>
                </div>
            </header>

            <div className="p-10 max-w-7xl mx-auto pb-32">
                
                {/* 1. HOME DASHBOARD (ZERO STATE FOR NEW USER) */}
                {view === "Home" && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-[2rem] p-10 relative overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                                <div className="relative z-10 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Welcome, Founder.</h2>
                                        <p className="text-emerald-200 max-w-lg text-sm font-mono mt-2">Protocol Online. Your profile is visible to 480+ Corporate Nodes.</p>
                                    </div>
                                    <button onClick={() => setView("Directory")} className="px-8 py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wide text-xs">Find Partners</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-xl">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Profile Views</div>
                                    <div className="text-4xl font-black text-white">0</div>
                                    <div className="text-[10px] text-slate-600 mt-2 font-mono font-bold">New Account</div>
                                </div>
                                <div className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-xl">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Pitches</div>
                                    <div className="text-4xl font-black text-emerald-400">{myRequests.filter(r=>r.status==='Pending' || r.status==='Sent').length}</div>
                                </div>
                                <div className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-xl">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Match Score</div>
                                    <div className="text-4xl font-black text-slate-600">--</div>
                                </div>
                            </div>

                            {/* ZERO DATA CHART */}
                            <div className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-xl">
                                <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider">Engagement Velocity</h3>
                                <div className="h-64 w-full flex items-center justify-center relative">
                                    <div className="absolute z-10 text-xs font-bold text-slate-600 uppercase tracking-widest bg-[#0A0A0C] px-4 py-2 border border-white/5 rounded-lg">Awaiting Data...</div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={ZERO_ANALYTICS}>
                                            <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#333', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#333', fontSize: 10}} />
                                            <CartesianGrid vertical={false} stroke="#18181b" strokeDasharray="3 3" />
                                            <Area type="monotone" dataKey="v" stroke="#333" strokeWidth={2} fillOpacity={1} fill="url(#colorV)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL */}
                        <div className="space-y-8">
                             {/* QUICK ACTIONS */}
                             <div className="grid grid-cols-2 gap-4">
                                <button className="p-6 bg-emerald-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex flex-col items-center gap-3 shadow-lg shadow-emerald-500/20">
                                    {ICONS.Upload} Upload Deck
                                </button>
                                <button className="p-6 bg-[#0F111A] border border-white/10 rounded-2xl text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex flex-col items-center gap-3">
                                    {ICONS.Rocket} Get Verified
                                </button>
                            </div>

                            {/* BROADCAST TEASER (Empty for new user) */}
                            <div className="bg-[#0A0A0C] border border-white/5 rounded-[2rem] p-8 shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Broadcasts</h3>
                                    <button onClick={()=>setView("Broadcast")} className="text-emerald-500 text-[10px] font-bold uppercase hover:underline">View All</button>
                                </div>
                                {myBroadcasts.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-slate-600 font-mono">No active signals found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {myBroadcasts.slice(0,2).map(b => (
                                            <div key={b.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                <div className="text-white font-bold text-sm truncate">{b.title}</div>
                                                <div className="flex justify-between mt-2">
                                                    <span className="text-[10px] text-slate-500 font-mono">{b.date}</span>
                                                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">{b.ask}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. BROADCAST VIEW (NEW FEATURE) */}
                {view === "Broadcast" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1 bg-[#0A0A0C] border border-emerald-500/20 p-8 rounded-[2rem] h-fit shadow-2xl">
                             <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 underline decoration-emerald-500 underline-offset-8">Broadcast Idea</h2>
                             <form onSubmit={handleBroadcast} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Project Title</label>
                                    <input value={newBroadcast.title} onChange={e=>setNewBroadcast({...newBroadcast, title: e.target.value})} placeholder="e.g. Series A Bridge Round" className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Funding Ask / Goal</label>
                                    <input value={newBroadcast.ask} onChange={e=>setNewBroadcast({...newBroadcast, ask: e.target.value})} placeholder="$1.5M" className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Description</label>
                                    <textarea value={newBroadcast.desc} onChange={e=>setNewBroadcast({...newBroadcast, desc: e.target.value})} placeholder="Short pitch to corporates..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-medium text-white h-32 resize-none focus:border-emerald-500 outline-none" />
                                </div>
                                <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-500/20">Go Live</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Active Signals</h3>
                            {myBroadcasts.length === 0 ? (
                                <div className="p-20 border border-white/5 border-dashed rounded-[2rem] text-center text-slate-600 font-mono text-sm">
                                    NO BROADCASTS DETECTED.<br/>USE THE FORM TO SIGNAL THE NETWORK.
                                </div>
                            ) : myBroadcasts.map(b => (
                                <div key={b.id} className="bg-[#0A0A0C]/80 border border-white/5 p-8 rounded-[2rem] flex justify-between items-center group hover:border-emerald-500/20 transition-all shadow-md">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest animate-pulse">LIVE</span>
                                            <span className="text-[10px] font-mono text-slate-600 font-bold">{b.date}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white">{b.title}</h4>
                                        <p className="text-xs text-slate-500 mt-2 max-w-md">{b.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-white font-mono">{b.ask}</div>
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Target</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. DIRECTORY (SUGGESTIONS) */}
                {view === "Directory" && (
                    <>
                        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            {["All", "AI", "Fintech", "Energy", "SaaS"].map(t => (
                                <button key={t} onClick={() => setFilter(t === "All" ? "" : t)} className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === (t==="All"?"":t) ? "bg-emerald-500 text-black border-emerald-500" : "border-white/10 bg-[#0A0A0C] text-slate-400 hover:text-white"}`}>{t}</button>
                            ))}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDirectory.map(corp => {
                                const status = getStatus(corp._id);
                                return (
                                    <div key={corp._id} className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] hover:border-emerald-500/30 hover:shadow-2xl transition-all group flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${corp.color} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>{corp.logo}</div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-white">{corp.match}%</div>
                                                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Match</div>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black text-white mb-1 uppercase italic tracking-tighter truncate">{corp.name}</h3>
                                        <div className="text-[10px] font-bold text-emerald-500 mb-4 uppercase tracking-widest">{corp.industry} • {corp.tag}</div>
                                        <p className="text-xs text-slate-400 mb-8 leading-relaxed line-clamp-2 flex-grow">{corp.desc}</p>
                                        
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 mt-auto">
                                            <button onClick={() => handleViewDetails(corp)} className="py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all">Profile</button>
                                            <button disabled={!!status} onClick={() => handleConnect(corp)} className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${status ? "bg-white/5 text-slate-600 cursor-not-allowed" : "bg-white text-black hover:bg-emerald-500 hover:text-white"}`}>
                                                {status ? "Sent" : "Connect"}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* 4. TRANSMISSIONS */}
                {view === "Requests" && (
                    <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-white/5 bg-[#0D0D10] flex justify-between items-center">
                            <div><h3 className="font-black text-white text-3xl uppercase tracking-tighter italic">Transmission Log</h3><p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Your outgoing pitch packets</p></div>
                            <div className="bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full text-[10px] font-black border border-emerald-500/20 tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">{myRequests.length} LOGS</div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {myRequests.length === 0 ? (
                                <div className="p-20 text-center text-slate-600 font-mono text-xs">NO TRANSMISSIONS RECORDED</div>
                            ) : myRequests.map(req => (
                                <div key={req._id} className="p-8 hover:bg-white/[0.02] flex flex-col md:flex-row justify-between md:items-center gap-6 group transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-bold text-slate-500 border border-white/10">{req.targetCompanyName ? req.targetCompanyName[0] : "C"}</div>
                                        <div>
                                            <div className="font-black text-white text-lg uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{req.targetCompanyName}</div>
                                            <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2 font-bold uppercase"><span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> {new Date(req.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 px-8 hidden md:block">
                                        <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Packet Payload</div>
                                        <div className="text-sm text-slate-300 italic truncate max-w-md opacity-60">"{req.message}"</div>
                                    </div>
                                    <div>
                                        <span className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${req.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{req.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. ⭐ CONFIG / SETTINGS (Redesigned) */}
                {view === "Settings" && (
                     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Settings Sidebar */}
                        <div className="md:col-span-1 space-y-2">
                            {["Profile", "Security", "Notifications"].map(tab => (
                                <button key={tab} onClick={() => setSettingsTab(tab)} className={`w-full text-left px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${settingsTab === tab ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Settings Content */}
                        <div className="md:col-span-3 bg-[#0A0A0C] border border-white/5 p-10 rounded-[2rem] relative shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-6 uppercase italic tracking-tighter">{settingsTab} Configuration</h3>
                            
                            {settingsTab === "Profile" && (
                                <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-900/50">
                                            {formData.name ? formData.name[0] : "U"}
                                        </div>
                                        <div>
                                            <button type="button" className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition-colors uppercase tracking-wider">Change Avatar</button>
                                            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">Max size 2MB (JPG/PNG)</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Operator Identity</label>
                                            <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-xs font-bold focus:border-emerald-500 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Startup Entity Name</label>
                                            <input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-xs font-bold focus:border-emerald-500 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Communication Node (Email)</label>
                                        <input value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-xs font-bold focus:border-emerald-500 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                                    </div>

                                    <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-white shadow-xl shadow-emerald-500/20 tracking-[0.2em] uppercase text-xs transition-all transform hover:-translate-y-1">Update Protocol</button>
                                </form>
                            )}

                            {settingsTab === "Security" && (
                                <div className="space-y-6">
                                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-bold text-sm uppercase">Two-Factor Authentication</h4>
                                            <p className="text-xs text-slate-500 mt-1">Secure your node with 2FA.</p>
                                        </div>
                                        <button className="px-6 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase hover:bg-emerald-500/20 transition-all">Enable</button>
                                    </div>
                                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-bold text-sm uppercase">Password Reset</h4>
                                            <p className="text-xs text-slate-500 mt-1">Last changed: 30 days ago</p>
                                        </div>
                                        <button className="px-6 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-xs font-bold uppercase hover:bg-white/10 transition-all">Change</button>
                                    </div>
                                </div>
                            )}

                            {settingsTab === "Notifications" && (
                                <div className="space-y-4">
                                    {["Broadcast Alerts", "Deal Inbound", "System Updates", "Marketplace Digest"].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                                            <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">{item}</span>
                                            <div className="w-10 h-5 bg-emerald-600 rounded-full relative cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                     </div>
                )}
            </div>

            {/* MODALS */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0F111A] border border-emerald-500/20 w-full max-w-lg p-8 rounded-[2rem] shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase italic">Transmit to {selectedCorp?.name}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-white font-bold">✕</button>
                        </div>
                        <textarea value={pitch} onChange={e => setPitch(e.target.value)} className="w-full h-40 bg-black border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none resize-none mb-6 font-mono text-sm" placeholder="Enter secure transmission message..." />
                        <div className="flex gap-4">
                            <button onClick={() => setModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-xl font-black text-slate-400 hover:bg-white/5 text-xs uppercase tracking-widest">Abort</button>
                            <button onClick={submitPitch} className="flex-1 py-4 bg-emerald-600 rounded-xl font-black text-white hover:bg-emerald-500 shadow-lg text-xs uppercase tracking-widest">Transmit</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            <AnimatePresence>
                {detailsOpen && selectedCorp && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0F111A] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className={`h-32 bg-gradient-to-r ${selectedCorp.color} relative`}>
                                <button onClick={() => setDetailsOpen(false)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/50 p-2 rounded-full text-white transition-colors">{ICONS.Close}</button>
                                <div className="absolute -bottom-10 left-8 w-24 h-24 bg-[#0F111A] rounded-2xl p-1 shadow-2xl">
                                    <div className="w-full h-full bg-[#1A1E29] rounded-xl flex items-center justify-center text-3xl font-bold text-white">
                                        {selectedCorp.logo}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-14 px-8 pb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white mb-1">{selectedCorp.name}</h2>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase text-slate-400 tracking-wider">{selectedCorp.industry}</span>
                                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">{selectedCorp.tag}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Budget</div>
                                        <div className="text-xl font-bold text-emerald-400">{selectedCorp.budget}</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Innovation Focus</h4>
                                        <p className="text-slate-300 leading-relaxed text-sm">{selectedCorp.desc}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Region</div>
                                            <div className="text-white font-bold">{selectedCorp.region}</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Match Score</div>
                                            <div className="text-white font-bold">{selectedCorp.match}% Compatibility</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button onClick={() => setDetailsOpen(false)} className="flex-1 py-3.5 border border-white/10 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all text-xs uppercase tracking-widest">Close</button>
                                    <button onClick={() => handleConnect(selectedCorp)} className="flex-1 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-xl text-xs uppercase tracking-widest">
                                        Connect Now
                                    </button>
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