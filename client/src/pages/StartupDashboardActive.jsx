import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// --- ICONS ---
const ICONS = {
    Home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Send: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    Bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Cog: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Info: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Close: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    Chart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    User: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Broadcast: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
};

// --- REALISTIC DATA ---
const GROWTH_DATA = [
    {name: 'Jan', v: 2400}, {name: 'Feb', v: 1398}, {name: 'Mar', v: 9800},
    {name: 'Apr', v: 3908}, {name: 'May', v: 4800}, {name: 'Jun', v: 3800}, {name: 'Jul', v: 4300},
];

const UPCOMING_MEETINGS = [
    { id: 1, title: "Series A Pitch w/ Sequoia", time: "Tomorrow, 10:00 AM", type: "Video" },
    { id: 2, title: "Tech Due Diligence w/ Tesla", time: "Thu, 2:00 PM", type: "In-Person" },
    { id: 3, title: "Legal Review", time: "Fri, 11:30 AM", type: "Call" },
];

const ACTIVE_DEALS = [
    { name: "Google Cloud", stage: "Term Sheet", amount: "$150k", status: "Reviewing" },
    { name: "Microsoft", stage: "2nd Meeting", amount: "N/A", status: "Scheduled" },
    { name: "Y Combinator", stage: "Application", amount: "$125k", status: "Pending" },
];

// ⭐ LIVE MANDATES (Visible Posts from Corporates)
const LIVE_MANDATES = [
    { id: 101, title: "Looking for AI-driven Supply Chain Pilots", sector: "Logistics", budget: "$100k Pilot", postedBy: "Global Logistics Corp", time: "2h ago", desc: "We are seeking startups with GenAI solutions to optimize our warehouse routing." },
    { id: 102, title: "Fintech Fraud Detection Series A", sector: "Fintech", budget: "$2M Invest", postedBy: "BankCorp Ventures", time: "5h ago", desc: "Corporate VC arm looking for fraud detection startups using behavioral biometrics." },
    { id: 103, title: "Carbon Capture Technology", sector: "CleanTech", budget: "$500k Grant", postedBy: "EcoEnergy Systems", time: "1d ago", desc: "Open call for direct air capture prototypes ready for field testing." },
];

// ⭐ FEATURED COMPANIES
const FEATURED_DIRECTORY = [
    { _id: "static_1", name: "Google Cloud", industry: "AI & Data", logo: "G", color: "from-blue-600 to-cyan-500", match: 98, desc: "Seeking GenAI solutions for Workspace integration.", tag: "Enterprise", budget: "$100k Pilot", region: "Global" },
    { _id: "static_2", name: "Tesla Energy", industry: "CleanTech", logo: "T", color: "from-red-600 to-rose-600", match: 85, desc: "Looking for battery optimization and manufacturing robotics.", tag: "Active Now", budget: "$250k Pilot", region: "USA/Europe" },
    { _id: "static_3", name: "Sequoia Capital", industry: "VC Firm", logo: "S", color: "from-green-600 to-emerald-400", match: 92, desc: "Series A/B funding for high-growth SaaS platforms.", tag: "Investor", budget: "$2M Investment", region: "Global" },
    { _id: "static_4", name: "Stripe", industry: "Fintech", logo: "S", color: "from-indigo-500 to-purple-500", match: 89, desc: "Payment infrastructure.", tag: "B2B Focus", budget: "$50k Grant", region: "Remote" },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F111A] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
          <p className="text-emerald-400 text-sm font-bold">{`${payload[0].value} Views`}</p>
        </div>
      );
    }
    return null;
};

export default function StartupDashboardActive() {
  const { user, logout, updateUser } = useAuth();
  
  // State
  const [view, setView] = useState("Home");
  // ⭐ PRE-POPULATED DATA FOR "ACTIVE" FEEL
  const [myRequests, setMyRequests] = useState([
      { _id: "req_1", targetCompanyName: "Microsoft", message: "Pitching our GenAI optimization layer for Azure...", status: "In Review", createdAt: "2024-12-15" },
      { _id: "req_2", targetCompanyName: "Sequoia", message: "Series A lead investor inquiry...", status: "Accepted", createdAt: "2024-12-10" },
      { _id: "req_3", targetCompanyName: "Y Combinator", message: "W25 Batch Application...", status: "Pending", createdAt: "2024-12-22" }
  ]);
  const [directory, setDirectory] = useState(FEATURED_DIRECTORY);
  const [mandates, setMandates] = useState(LIVE_MANDATES);
  
  // ⭐ BROADCAST STATE (POSTING IDEAS)
  const [myBroadcasts, setMyBroadcasts] = useState([
      { id: 1, title: "Series A - AI Logistics", ask: "$2M", desc: "Optimizing last mile delivery with RL.", date: "2024-12-20" }
  ]);
  const [newBroadcast, setNewBroadcast] = useState({ title: "", ask: "", desc: "" });

  // UI State
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState(null);
  const [pitch, setPitch] = useState("");
  const [toast, setToast] = useState(null);
  
  // ⭐ SETTINGS TAB STATE
  const [settingsTab, setSettingsTab] = useState("Profile");
  const [formData, setFormData] = useState({ name: "", companyName: "", email: "", bio: "" });

  // 1. Fetch Real Data
  useEffect(() => {
    if (user) {
        setFormData({ 
            name: user.name || "", 
            companyName: user.companyName || "", 
            email: user.email || "",
            bio: "We are building the future of..."
        });
        fetchCorporates();
        // We comment this out to keep the mock data for the "Active" feel unless you want real backend
        // fetchRequests(); 
    }
  }, [user]);

  const getToken = () => localStorage.getItem("cx_token");

  // --- API FUNCTIONS ---
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
            setDirectory([...FEATURED_DIRECTORY, ...realCorps]);
        }
    } catch(err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/applications/sent", {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if(res.ok && data.length > 0) setMyRequests(prev => [...prev, ...data]);
    } catch(err) { console.error(err); }
  };

  const showToast = (msg, type="success") => {
      setToast({msg, type});
      setTimeout(() => setToast(null), 3000);
  };

  const getStatus = (receiverId) => {
      const req = myRequests.find(r => r.receiver === receiverId);
      return req ? req.status : null;
  };

  // --- INTERACTIONS ---
  const handleConnect = (corp) => {
      if(getStatus(corp._id)) return showToast("Request already pending", "error");
      setSelectedCorp(corp);
      setDetailsOpen(false);
      setPitch("");
      setModalOpen(true);
  };

  const handleApplyToMandate = (id) => {
      setMandates(prev => prev.filter(m => m.id !== id));
      showToast("Application submitted to Corporate Partner!");
  };

  const handleViewDetails = (corp) => {
      setSelectedCorp(corp);
      setDetailsOpen(true);
  };

  // ⭐ HANDLE BROADCAST (POST IDEA)
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
      
      // Update UI Immediately (Optimistic UI)
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

      if (selectedCorp._id.startsWith("static")) return;

      try {
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
      } catch (err) {
        // Silent fail as UI is already updated
      }
  };

  const handleSaveSettings = (e) => {
      e.preventDefault();
      updateUser(formData);
      showToast("Profile Updated Successfully!");
  };

  if(!user) return <div className="h-screen bg-[#050505] text-white flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="flex h-screen bg-[#050505] font-sans text-slate-300 overflow-hidden selection:bg-emerald-500 selection:text-white">
        
        {toast && <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg z-50 animate-bounce font-bold border border-white/10 ${toast.type === 'error' ? 'bg-red-900 text-white' : 'bg-emerald-600 text-white'}`}>{toast.msg}</div>}

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#0F111A]/90 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
            <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#020617]">
                <div className="text-xl font-black text-white tracking-tighter">START<span className="text-emerald-500">UP</span>.OS</div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Platform</div>
                    {[
                        {id:"Home", icon:ICONS.Home, label:"Command Center"},
                        {id:"Directory", icon:ICONS.Globe, label:"Partner Network"},
                        {id:"Marketplace", icon:ICONS.Briefcase, label:"Marketplace", badge: mandates.length},
                        {id:"Broadcast", icon:ICONS.Broadcast, label:"Post Idea"},
                        {id:"Requests", icon:ICONS.Send, label:"Transmissions", badge: myRequests.length},
                    ].map(item => (
                        <button key={item.id} onClick={() => setView(item.id)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all border border-transparent ${view === item.id ? "bg-emerald-600/10 border-emerald-500/50 text-white" : "hover:bg-white/5 hover:text-white text-slate-400"}`}>
                            <span className="flex items-center gap-3">{item.icon} {item.label}</span>
                            {item.badge > 0 && <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
                        </button>
                    ))}
                </div>
                
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">System</div>
                    <button onClick={() => setView("Settings")} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all border border-transparent ${view === "Settings" ? "bg-emerald-600/10 border-emerald-500/50 text-white" : "hover:bg-white/5 hover:text-white text-slate-400"}`}>
                        <span className="flex items-center gap-3">{ICONS.Cog} Config</span>
                    </button>
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0A0C12]/50 mt-auto">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-xs text-emerald-400 truncate">Pro Account</div>
                    </div>
                </div>
                <button onClick={logout} className="w-full py-2 border border-white/10 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors">LOGOUT</button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
            <header className="h-24 flex items-center justify-between px-10 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-20">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{view === 'Home' ? 'Active Dashboard' : view}</h1>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                         <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">System Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                        Seed Round: Open
                    </div>
                    <div className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white cursor-pointer relative">
                        {ICONS.Bell}
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050505]"></span>
                    </div>
                </div>
            </header>

            <div className="p-10 max-w-7xl mx-auto pb-32">
                
                {/* 1. HOME VIEW */}
                {view === "Home" && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            
                            {/* High-Level Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-[#0F111A] border border-white/5 p-6 rounded-2xl">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Impressions</div>
                                    <div className="text-4xl font-black text-white">12,405</div>
                                    <div className="text-xs text-emerald-400 mt-2 font-mono">↑ 12% vs last week</div>
                                </div>
                                <div className="bg-[#0F111A] border border-white/5 p-6 rounded-2xl">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Investor Interest</div>
                                    <div className="text-4xl font-black text-emerald-400">8</div>
                                    <div className="text-xs text-slate-500 mt-2 font-mono">Active Conversations</div>
                                </div>
                                <div className="bg-[#0F111A] border border-white/5 p-6 rounded-2xl">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pipeline Value</div>
                                    <div className="text-4xl font-black text-white">$450k</div>
                                    <div className="text-xs text-slate-500 mt-2 font-mono">Potential Grants</div>
                                </div>
                            </div>

                            {/* Growth Chart */}
                            <div className="bg-[#0F111A] border border-white/5 p-8 rounded-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white">Profile Traction</h3>
                                    <select className="bg-black border border-white/10 text-xs text-white p-2 rounded-lg outline-none">
                                        <option>Last 6 Months</option>
                                        <option>This Year</option>
                                    </select>
                                </div>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={GROWTH_DATA}>
                                            <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: ACTION ITEMS */}
                        <div className="space-y-8">
                            <div className="bg-[#0F111A] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Calendar</h3>
                                <div className="space-y-4">
                                    {UPCOMING_MEETINGS.map(m => (
                                        <div key={m.id} className="flex gap-4 p-3 bg-[#151925] rounded-xl border-l-4 border-emerald-500">
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-emerald-400">Video</div>
                                                <div className="text-[10px] text-slate-500">Zoom</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{m.title}</div>
                                                <div className="text-xs text-slate-400">{m.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#0F111A] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Deal Pipeline</h3>
                                <div className="space-y-4">
                                    {ACTIVE_DEALS.map((d, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                            <div>
                                                <div className="text-white font-bold text-sm">{d.name}</div>
                                                <div className="text-xs text-slate-500">{d.stage}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-bold text-sm">{d.amount}</div>
                                                <div className={`text-[10px] font-bold uppercase ${d.status === 'Pending' ? 'text-yellow-500' : 'text-emerald-500'}`}>{d.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. DIRECTORY VIEW */}
                {view === "Directory" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {directory.map(corp => {
                            const status = getStatus(corp._id);
                            return (
                                <div key={corp._id} className="bg-[#0F111A] border border-white/5 p-7 rounded-3xl hover:border-emerald-500/40 hover:bg-[#13161F] transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${corp.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>{corp.logo}</div>
                                        <div className="text-right"><div className="text-lg font-black text-white">{corp.match}%</div><div className="text-[9px] text-slate-500 uppercase font-bold">Match</div></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors truncate">{corp.name}</h3>
                                    <div className="text-xs font-bold text-emerald-500 mb-4 uppercase tracking-wider">{corp.industry} • {corp.tag}</div>
                                    <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-2 flex-grow">{corp.desc}</p>
                                    
                                    <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4 mt-auto">
                                        <button onClick={() => handleViewDetails(corp)} className="py-2.5 rounded-lg font-bold text-xs uppercase bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                                            {ICONS.Info} Profile
                                        </button>
                                        <button disabled={!!status} onClick={() => handleConnect(corp)} className={`py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${status ? "bg-white/5 text-slate-600 cursor-not-allowed" : "bg-white text-black hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"}`}>
                                            {status ? "Sent" : "Connect"}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* 3. MARKETPLACE VIEW */}
                {view === "Marketplace" && (
                    <div className="space-y-6">
                        <div className="bg-[#0F111A] border border-white/5 rounded-3xl p-8 mb-8 bg-gradient-to-r from-emerald-900/10 to-transparent">
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Live Opportunities</h2>
                            <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
                                Direct mandates posted by our corporate partners. Active solicitations for pilots, investment, or partnerships.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {mandates.map(post => (
                                <div key={post.id} className="bg-[#0A0C12] border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all group flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Active Mandate</div>
                                        <div className="text-xs text-zinc-500 font-mono">{post.time}</div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{post.title}</h3>
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                                        {post.postedBy} • {post.sector}
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-grow">
                                        {post.desc}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                                        <div>
                                            <div className="text-[10px] text-zinc-600 font-bold uppercase">Budget</div>
                                            <div className="text-white font-mono font-bold">{post.budget}</div>
                                        </div>
                                        <button onClick={() => handleApplyToMandate(post.id)} className="bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. BROADCAST VIEW (NEW FEATURE) */}
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
                            {myBroadcasts.map(b => (
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

                {/* 5. REQUESTS VIEW */}
                {view === "Requests" && (
                    <div className="bg-[#0F111A] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-[#13161F] flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm">Transmission Log</h3>
                            <span className="text-xs text-slate-500">{myRequests.length} Records</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {myRequests.map(req => (
                                <div key={req._id} className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1A1E29] flex items-center justify-center font-bold text-slate-400 border border-white/5">{req.targetCompanyName ? req.targetCompanyName[0] : "C"}</div>
                                        <div>
                                            <div className="font-bold text-white text-lg">{req.targetCompanyName}</div>
                                            <div className="text-sm text-slate-500 font-mono mt-1 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                                                {req.createdAt}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 px-8 hidden md:block">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Preview</div>
                                        <div className="text-sm text-slate-300 italic truncate max-w-md opacity-70">"{req.message}"</div>
                                    </div>
                                    <div className="flex items-center gap-4 min-w-[150px] justify-end">
                                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${req.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{req.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. SETTINGS VIEW */}
                {view === "Settings" && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
                        <div className="bg-[#0F111A] border border-white/5 rounded-2xl p-4 h-fit">
                            {["General", "Security", "Team", "Billing"].map(tab => (
                                <button key={tab} onClick={() => setSettingsTab(tab)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all mb-1 ${settingsTab === tab ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="lg:col-span-3 bg-[#0F111A] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">{settingsTab} Settings</h3>
                            {settingsTab === "General" && (
                                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label><input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label><input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all" /></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Bio</label><textarea value={formData.bio} onChange={e=>setFormData({...formData, bio:e.target.value})} className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all resize-none" /></div>
                                    <div className="flex justify-end pt-4"><button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white shadow-lg tracking-wide transition-all">Save Changes</button></div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0F111A] border border-white/10 w-full max-w-lg p-8 rounded-3xl shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Pitch to {selectedCorp?.name}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-white font-bold">✕</button>
                        </div>
                        <textarea value={pitch} onChange={e => setPitch(e.target.value)} className="w-full h-40 bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none resize-none mb-6 font-mono text-sm" placeholder="Enter transmission message..." />
                        <div className="flex gap-4">
                            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-white/10 rounded-xl font-bold text-slate-400 hover:bg-white/5">ABORT</button>
                            <button onClick={submitPitch} className="flex-1 py-3 bg-emerald-600 rounded-xl font-bold text-white hover:bg-emerald-500 shadow-lg">TRANSMIT</button>
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
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">{selectedCorp.tag}</span>
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
                                    <button onClick={() => setDetailsOpen(false)} className="flex-1 py-3.5 border border-white/10 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all">CLOSE</button>
                                    <button onClick={() => handleConnect(selectedCorp)} className="flex-1 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-emerald-500 hover:text-white hover:scale-[1.02] transition-all shadow-xl">
                                        CONNECT NOW
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