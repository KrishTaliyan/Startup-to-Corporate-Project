import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { 
    AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, 
    CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

/** * --- SYSTEM CONSTANTS ---  */
const ICONS = {
    Dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Inbox: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>,
    History: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Post: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Check: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
    X: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
};

const PERFORMANCE_DATA = [
    { name: "2024-Q1", value: 12.5, flow: 400 },
    { name: "2024-Q2", value: 14.2, flow: 300 },
    { name: "2024-Q3", value: 13.8, flow: 500 },
    { name: "2024-Q4", value: 21.5, flow: 700 },
    { name: "2025-Q1", value: 28.1, flow: 850 },
    { name: "2025-Q2", value: 34.8, flow: 1100 },
];

const ALLOCATION_DATA = [
    { name: "DeepTech", value: 45, color: "#10b981", risk: "Low" },
    { name: "Fintech", value: 30, color: "#3b82f6", risk: "Medium" },
    { name: "SaaS", value: 25, color: "#8b5cf6", risk: "Low" },
];

const INITIAL_SUGGESTIONS = [
    { id: "s1", name: "NeuroLink Pro", industry: "NeuroTech", stage: "Series A", ask: "$15.5M", match: 98, founder: "Dr. Aris", connected: false },
    { id: "s2", name: "CarbonShield", industry: "ClimateTech", stage: "Seed", ask: "$2.8M", match: 94, founder: "S. Varma", connected: false },
    { id: "s3", name: "QuantumSafe", industry: "Cybersecurity", stage: "Series B", ask: "$22M", match: 91, founder: "L. Chen", connected: false },
    { id: "s4", name: "AgriVision", industry: "AgriTech", stage: "Seed", ask: "$1.2M", match: 88, founder: "P. Scott", connected: false },
];

const MOCK_HISTORICAL_LOGS = [
    { id: 901, name: "BioGenix", status: "Rejected", date: "2024-12-10", reason: "Market Saturation" },
    { id: 902, name: "Stripe", status: "Accepted", date: "2024-11-05", reason: "Follow-on investment" },
    { id: 903, name: "CloudScale", status: "Accepted", date: "2024-10-22", reason: "Infrastructure alignment" },
];

export default function CorporateDashboardActive() {
    const { user, logout, updateUser } = useAuth();
    const [view, setView] = useState("Dashboard");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);

    // Deal Requests State
    const [requests, setRequests] = useState([
        { _id: "m1", startupName: "Hyperion AI", senderEmail: "founder@hyperion.ai", message: "Pitching Series B lead. Term sheet attached for $12M round.", createdAt: new Date().toISOString(), status: "Pending" }
    ]);

    // Corporate Posts (Mandates)
    const [myPosts, setMyPosts] = useState([
        { id: 101, title: "Looking for AI-driven Supply Chain Pilots", sector: "Logistics", budget: "$100k Pilot", applicants: 3, timestamp: "2024-12-24" }
    ]);
    const [newPost, setNewPost] = useState({ title: "", sector: "", budget: "", description: "" });

    const [history, setHistory] = useState(MOCK_HISTORICAL_LOGS);
    const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
    
    // Config State
    const [formData, setFormData] = useState({ 
        name: "", 
        companyName: "", 
        thesis: "Series A Agnostic", 
        checkSize: "$500k - $2M",
        emailNotifications: true 
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        if (user) {
            setFormData(prev => ({ 
                ...prev,
                name: user.name || "", 
                companyName: user.companyName || "" 
            }));
            fetchLiveRequests();
        }
        return () => clearTimeout(timer);
    }, [user]);

    const fetchLiveRequests = async () => {
        try {
            const token = localStorage.getItem("cx_token");
            const res = await fetch("http://localhost:5000/api/applications/received", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setRequests(prev => [...prev, ...data]);
            }
        } catch (err) {
            console.warn("Backend unavailable, running on local state.");
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        const postEntry = {
            ...newPost,
            id: Date.now(),
            applicants: 0,
            timestamp: new Date().toISOString().split('T')[0]
        };
        setMyPosts([postEntry, ...myPosts]);
        setNewPost({ title: "", sector: "", budget: "", description: "" });
        showToast("Mandate Published. Visible to all verified startups.");
    };

    const handleConnect = (startup) => {
        if (startup.connected) return;
        setSuggestions(prev => prev.map(s => s.id === startup.id ? { ...s, connected: true } : s));
        const outboundDeal = {
            _id: `outbound_${Date.now()}`,
            startupName: startup.name,
            senderEmail: `hq@${startup.name.toLowerCase().replace(" ", "")}.io`,
            message: `SYSTEM ALERT: Outbound mandate initiated. AI Match: ${startup.match}%`,
            createdAt: new Date().toISOString(),
            status: "Pending"
        };
        setRequests(prev => [outboundDeal, ...prev]);
        showToast(`Request Transmitted to ${startup.name}`);
    };

    const handleAction = (id, status) => {
        const target = requests.find(r => r._id === id);
        setRequests(prev => prev.filter(r => r._id !== id));
        if (target) {
            setHistory(prev => [{
                id: target._id,
                name: target.startupName,
                status: status,
                date: new Date().toLocaleDateString(),
                reason: status === "Accepted" ? "Mandate Approved" : "Screened Out"
            }, ...prev]);
        }
        showToast(status === "Accepted" ? "Added to Portfolio" : "Deal Archived");
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        // Here you would call updateUser(formData)
        showToast("System Protocol Updated Successfully");
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0A0A0A] border border-emerald-500/20 p-4 rounded-xl shadow-2xl font-mono backdrop-blur-xl">
                    <p className="text-zinc-500 text-[10px] uppercase mb-1 tracking-widest">{label}</p>
                    <p className="text-emerald-400 font-black text-lg">{`$${payload[0].value}M NAV`}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="h-screen bg-[#020203] flex flex-col items-center justify-center font-mono">
            <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
            <div className="text-emerald-500 text-xs tracking-[0.4em] uppercase animate-pulse font-bold">Initializing Fund Console...</div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#020203] font-sans text-zinc-300 overflow-hidden selection:bg-emerald-500 selection:text-white">
            
            {/* Subtle Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} 
                        className="fixed top-6 right-1/2 translate-x-1/2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-2xl z-50 font-bold text-xs border border-white/10 backdrop-blur-md flex items-center gap-3 tracking-wide uppercase">
                        <span className="bg-white/20 rounded-md px-1.5 py-0.5">✓</span> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDEBAR NAVIGATION */}
            <aside className="w-72 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
                <div className="h-24 flex items-center px-8 border-b border-white/5 bg-gradient-to-r from-emerald-950/20 to-transparent">
                    <div className="text-2xl font-black text-white tracking-tighter uppercase italic">Connect<span className="text-emerald-500">X</span></div>
                </div>
                
                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                    {[
                        { id: "Dashboard", label: "Overview", icon: ICONS.Dashboard },
                        { id: "Inbox", label: "Deal Pipeline", icon: ICONS.Inbox, badge: requests.length },
                        { id: "CreatePost", label: "Marketplace Post", icon: ICONS.Post },
                        { id: "Scout", label: "AI Sourcing", icon: ICONS.Search },
                        { id: "History", label: "Archived Logs", icon: ICONS.History },
                    ].map(item => (
                        <button key={item.id} onClick={() => setView(item.id)} 
                            className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all group duration-300 ${view === item.id ? "bg-emerald-500/10 text-white border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                            <div className="flex items-center gap-3">{item.icon} <span className="ml-1 tracking-tight">{item.label}</span></div>
                            {item.badge > 0 && <span className={`text-[10px] px-2 py-0.5 rounded font-black ${view === item.id ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>{item.badge}</span>}
                        </button>
                    ))}

                    <div className="pt-8 px-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3">System</div>
                    <button onClick={() => setView("Settings")} className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all duration-300 ${view === "Settings" ? "bg-emerald-500/10 text-white border border-emerald-500/20" : "text-zinc-500 hover:text-white"}`}>
                        {ICONS.Settings} <span className="ml-1 tracking-tight">System Config</span>
                    </button>
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 mt-auto backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/50">{user.name ? user.name[0] : "U"}</div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">{user.name}</div>
                            <div className="text-[9px] text-emerald-500 font-black tracking-widest uppercase">General Partner</div>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full py-3 border border-red-500/20 rounded-xl text-xs font-black text-red-400 hover:bg-red-500/10 hover:text-red-200 transition-all uppercase tracking-widest">Terminate Session</button>
                </div>
            </aside>

            {/* MAIN DASHBOARD SPACE */}
            <main className="flex-1 overflow-y-auto relative scrollbar-hide z-10">
                <div className="h-10 bg-[#020203]/80 backdrop-blur-sm border-b border-white/5 flex items-center px-8 overflow-hidden sticky top-0 z-30 font-mono text-[9px] text-emerald-600/60 tracking-[0.3em] uppercase">
                    • Fund NAV: $34.8M (+12.4%) • Connection Node: Online • Latency: 12ms • Encryption: AES-256
                </div>

                <div className="p-12 max-w-[1400px] mx-auto space-y-10">
                    
                    {/* --- VIEW 1: OVERVIEW --- */}
                    {view === "Dashboard" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <header className="flex justify-between items-end border-b border-white/5 pb-8">
                                <div><h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Fund Overview</h1><p className="text-sm text-zinc-400 mt-2 uppercase tracking-widest font-mono">Real-time matching & liquidity console</p></div>
                                <div className="text-right">
                                    <div className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-black">$34,842,000</div>
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1 italic">Verified Assets</div>
                                </div>
                            </header>

                            <div className="grid grid-cols-4 gap-6">
                                {[
                                    { l: 'Pending Deals', v: requests.length, s: 'Inbound' },
                                    { l: 'Active Mandates', v: myPosts.length, s: 'Live Posts' },
                                    { l: 'Yield Growth', v: '+34.2%', s: 'Annualized' },
                                    { l: 'Network Reach', v: '480+', s: 'Startup Nodes' }
                                ].map((k, i) => (
                                    <div key={i} className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] group hover:border-emerald-500/30 transition-all shadow-xl">
                                        <div className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-wider">{k.l}</div>
                                        <div className="text-3xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors">{k.v}</div>
                                        <div className="text-[10px] text-zinc-700 font-bold mt-3 uppercase tracking-tighter">{k.s}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-2xl">
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={PERFORMANCE_DATA}>
                                                <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                                                <CartesianGrid vertical={false} stroke="#18181b" strokeDasharray="3 3" />
                                                <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} dy={10} tick={{fill: '#52525b', fontWeight: 'bold'}} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorV)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center shadow-2xl">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center mb-8 italic">Asset Allocation</h3>
                                    <div className="h-48 w-full"><ResponsiveContainer><PieChart><Pie data={ALLOCATION_DATA} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">{ALLOCATION_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart></ResponsiveContainer></div>
                                    <div className="space-y-3 mt-6 text-[10px] font-bold uppercase">
                                        {ALLOCATION_DATA.map(a => <div key={a.name} className="flex justify-between px-4 py-2 bg-white/5 rounded-lg border border-white/5"><span className="text-zinc-400">{a.name}</span><span className="text-white">{a.value}%</span></div>)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- VIEW 2: CREATE POST --- */}
                    {view === "CreatePost" && (
                        <div className="grid grid-cols-3 gap-10 max-w-[1200px] mx-auto">
                            <div className="col-span-1 bg-[#0A0A0C] border border-emerald-500/20 p-8 rounded-[2rem] h-fit shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 underline decoration-emerald-500 underline-offset-8">Post Mandate</h2>
                                <form onSubmit={handleCreatePost} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Requirement Title</label>
                                        <input value={newPost.title} onChange={e=>setNewPost({...newPost, title: e.target.value})} placeholder="e.g. Seeking Cybersecurity Pilots" className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-colors" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Sector</label>
                                            <input value={newPost.sector} onChange={e=>setNewPost({...newPost, sector: e.target.value})} placeholder="FinTech" className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-colors" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Pilot Budget</label>
                                            <input value={newPost.budget} onChange={e=>setNewPost({...newPost, budget: e.target.value})} placeholder="$50k" className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-colors" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Short Description</label>
                                        <textarea value={newPost.description} onChange={e=>setNewPost({...newPost, description: e.target.value})} placeholder="Details for founders..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-medium text-white h-32 resize-none focus:border-emerald-500 outline-none transition-colors" />
                                    </div>
                                    <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1">Broadcast Post</button>
                                </form>
                            </div>

                            <div className="col-span-2 space-y-6">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">My Active Posts</h3>
                                {myPosts.length === 0 ? (
                                    <div className="p-20 text-center text-zinc-700 italic border border-white/5 border-dashed rounded-3xl bg-white/[0.01]">No live connection mandates.</div>
                                ) : myPosts.map(post => (
                                    <div key={post.id} className="bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] flex justify-between items-center group hover:border-emerald-500/20 transition-all shadow-md">
                                        <div className="flex-1 pr-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest animate-pulse">LIVE</span>
                                                <span className="text-[10px] font-mono text-zinc-600 font-bold">{post.timestamp}</span>
                                            </div>
                                            <h4 className="text-2xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">{post.title}</h4>
                                            <div className="flex gap-8 mt-6 text-[10px] font-bold text-zinc-500 uppercase italic">
                                                <span>Sector: <span className="text-zinc-300">{post.sector}</span></span>
                                                <span>Pilot Cap: <span className="text-zinc-300 font-mono tracking-normal">{post.budget}</span></span>
                                            </div>
                                        </div>
                                        <div className="text-right border-l border-white/5 pl-8">
                                            <div className="text-4xl font-black text-white">{post.applicants}</div>
                                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Inbound</div>
                                            <button className="mt-6 text-[10px] font-black text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-black transition-all">View</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- VIEW 3: INBOX --- */}
                    {view === "Inbox" && (
                        <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] overflow-hidden min-h-[500px] shadow-2xl">
                            <div className="p-10 border-b border-white/5 bg-[#0D0D10] flex justify-between items-center">
                                <div><h3 className="font-black text-white text-3xl uppercase tracking-tighter italic">Incoming Signals</h3><p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Transmissions triggered by your Marketplace Posts</p></div>
                                <div className="bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full text-[10px] font-black border border-emerald-500/20 tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">{requests.length} PENDING</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {requests.map(req => (
                                    <div key={req._id} className="p-10 hover:bg-white/[0.02] flex items-start gap-10 group transition-colors">
                                        <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-black rounded-2xl flex items-center justify-center text-white text-3xl font-black border border-white/10 shrink-0 uppercase italic shadow-lg">{req.startupName[0]}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div><h4 className="text-2xl font-bold text-zinc-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{req.startupName}</h4><div className="text-xs font-mono text-zinc-600 mt-2 uppercase font-bold tracking-wider">{req.senderEmail}</div></div>
                                                <div className="text-[10px] font-bold text-zinc-700 bg-white/5 px-3 py-1 rounded h-fit">{new Date(req.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mt-8 leading-relaxed italic text-zinc-400 text-sm relative backdrop-blur-sm">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 rounded-l-2xl"></div>
                                                "{req.message}"
                                            </div>
                                            <div className="flex gap-4 mt-8">
                                                <button onClick={() => handleAction(req._id, 'Accepted')} className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[10px] font-black text-white uppercase transition-all shadow-xl shadow-emerald-500/10 active:scale-95 tracking-widest">Accept Mandate</button>
                                                <button onClick={() => handleAction(req._id, 'Rejected')} className="px-10 py-3 border border-white/10 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-[10px] font-black text-zinc-600 uppercase transition-all active:scale-95 tracking-widest">Archive</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- VIEW 4: AI SCOUT --- */}
                    {view === "Scout" && (
                        <div className="space-y-8">
                            <header><h2 className="text-3xl font-black text-white uppercase tracking-tight italic">System Discoveries</h2><p className="text-sm text-zinc-400 uppercase italic">Algorithmic matches based on your investment thesis</p></header>
                            <div className="grid grid-cols-2 gap-8">
                                {suggestions.map(s => (
                                    <div key={s.id} className="bg-[#0A0A0C]/90 border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group hover:border-emerald-500/30 transition-all hover:-translate-y-1 duration-300 shadow-2xl">
                                        {s.connected && <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md z-10 flex items-center justify-center font-black text-white text-sm tracking-widest uppercase italic">Transmission Sent ✓</div>}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-emerald-500 font-black text-3xl italic shadow-inner">{s.name[0]}</div>
                                            <div className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase italic tracking-tighter">{s.match}% SYSTEM ALIGN</div>
                                        </div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{s.name}</h3><div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-2 mb-10">{s.industry} • {s.stage}</div>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-8">
                                            <div><div className="text-[9px] text-zinc-700 font-black uppercase tracking-widest mb-1">Target Ask</div><div className="text-white font-mono font-bold text-2xl tracking-tighter italic underline decoration-emerald-500/30 decoration-2">{s.ask}</div></div>
                                            <button onClick={() => handleConnect(s)} className="bg-white text-black font-black text-[10px] px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 transform hover:scale-105">Send Mandate</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- VIEW 5: HISTORY --- */}
                    {view === "History" && (
                        <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-black text-[9px] font-black uppercase text-zinc-600 border-b border-white/5 tracking-widest">
                                    <tr><th className="px-10 py-6">Startup Entity</th><th className="px-10 py-6">Processed Date</th><th className="px-10 py-6 text-center">Resolution</th><th className="px-10 py-6 text-right">Fund Action</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-zinc-500 font-mono text-xs">
                                    {history.map((h, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-10 py-8 font-black text-white uppercase italic tracking-tighter text-lg">{h.name}</td>
                                            <td className="px-10 py-8 uppercase tracking-widest opacity-60 font-bold text-[10px]">{h.date}</td>
                                            <td className="px-10 py-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${h.status === 'Accepted' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}>{h.status}</span></td>
                                            <td className="px-10 py-8 text-right opacity-60 italic">{h.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- ⭐ VIEW 6: SYSTEM SETTINGS (CONFIG) --- */}
                    {view === "Settings" && (
                        <div className="max-w-5xl mx-auto space-y-10">
                            <header className="border-b border-white/5 pb-8">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">System Configuration</h2>
                                <p className="text-sm text-zinc-500 mt-2 uppercase tracking-widest font-bold">Protocol Parameters & Fund Logic</p>
                            </header>

                            <form onSubmit={handleSaveSettings} className="grid grid-cols-2 gap-8">
                                {/* General Protocol */}
                                <div className="col-span-2 md:col-span-1 bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-xl">
                                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> General Protocol
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Firm Entity Name</label>
                                            <input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Operating Partner</label>
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                {/* Algorithm Calibration */}
                                <div className="col-span-2 md:col-span-1 bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-xl">
                                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Algorithm Calibration
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Investment Thesis</label>
                                            <input value={formData.thesis} onChange={e => setFormData({...formData, thesis: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Target Check Size</label>
                                            <select value={formData.checkSize} onChange={e => setFormData({...formData, checkSize: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold text-zinc-300 focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer">
                                                <option>$100k - $500k</option>
                                                <option>$500k - $2M</option>
                                                <option>$2M - $10M</option>
                                                <option>$10M+</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Notification Nodes */}
                                <div className="col-span-2 bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-xl flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">Notification Nodes</h3>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Route high-priority signals to email gateway</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-12 h-6 rounded-full p-1 transition-all ${formData.emailNotifications ? 'bg-emerald-600' : 'bg-zinc-800'}`} onClick={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${formData.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Email Alerts</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="col-span-2 pt-6">
                                    <button type="submit" className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl uppercase text-sm tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1">
                                        Update System Protocol
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}