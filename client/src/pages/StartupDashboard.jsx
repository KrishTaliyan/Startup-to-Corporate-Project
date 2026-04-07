import React, { useState, useEffect, useMemo } from "react";
// Mock useAuth if it doesn't exist in your actual setup
import { useAuth } from "../Context/AuthContext";
import { 
    AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. MASSIVE ICON LIBRARY (Aesthetic Light Theme)
// ==========================================
const ICONS = {
    Menu: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Send: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    Info: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Close: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    Broadcast: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    Cog: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Rocket: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Upload: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    User: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Lock: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    CheckCircle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    TrendingUp: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Target: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    Shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
};

// ==========================================
// 2. MASSIVE MOCK DATA SUITE
// ==========================================
// The Directory: Who the startup can pitch to
const FEATURED_DIRECTORY = [
    { 
        _id: "static_1", name: "Google Cloud for Startups", industry: "AI & Data", logo: "G", 
        color: "from-blue-400 to-cyan-500", match: 98, 
        desc: "Seeking Generative AI solutions for Workspace integration. We provide non-dilutive capital and massive cloud credits for early-stage MERN/Python stacks.", 
        tag: "Enterprise Partner", budget: "$100k Pilot + $350k Credits", region: "Global",
        metrics: { invested: "$2.4B", portfolio: "4,500+", avgCheck: "$150k" }
    },
    { 
        _id: "static_2", name: "Sequoia Capital", industry: "VC Firm", logo: "S", 
        color: "from-emerald-400 to-teal-500", match: 92, 
        desc: "Legendary venture firm looking for category-defining founders. We lead Seed and Series A rounds for high-growth SaaS and deep-tech platforms.", 
        tag: "Lead Investor", budget: "$2M - $10M Investment", region: "Global",
        metrics: { invested: "$85B+", portfolio: "1,200+", avgCheck: "$4.5M" }
    },
    { 
        _id: "static_3", name: "Y Combinator", industry: "Accelerator", logo: "Y", 
        color: "from-orange-400 to-rose-500", match: 95, 
        desc: "The world's most powerful startup accelerator. Accepting applications for the upcoming batch. We invest $500k on a standard SAFE.", 
        tag: "Accelerator", budget: "$500k Standard Deal", region: "San Francisco / Remote",
        metrics: { invested: "$1.5B", portfolio: "4,000+", avgCheck: "$500k" }
    },
    { 
        _id: "static_4", name: "Tesla Energy Hub", industry: "CleanTech", logo: "T", 
        color: "from-red-500 to-rose-600", match: 85, 
        desc: "Looking for battery optimization, grid management software, and manufacturing robotics. Hardware and DeepTech focus.", 
        tag: "Corporate Venture", budget: "$250k Pilot", region: "USA / Europe",
        metrics: { invested: "$400M", portfolio: "45+", avgCheck: "$2.5M" }
    },
    { 
        _id: "static_5", name: "Stripe Connections", industry: "Fintech", logo: "S", 
        color: "from-indigo-400 to-violet-500", match: 89, 
        desc: "Seeking API-first platforms optimizing payment infrastructure, billing automation, or fraud detection. B2B SaaS focus.", 
        tag: "Strategic Partner", budget: "$50k Grant + Integration", region: "Remote",
        metrics: { invested: "$120M", portfolio: "150+", avgCheck: "$100k" }
    },
    { 
        _id: "static_6", name: "BMW iVentures", industry: "Automotive", logo: "B", 
        color: "from-sky-400 to-blue-600", match: 82, 
        desc: "Investing in next-gen cockpit UI, autonomous driving sensors, and supply chain logistics platforms.", 
        tag: "Innovation Hub", budget: "$1.5M Seed", region: "Germany / Global",
        metrics: { invested: "$800M", portfolio: "80+", avgCheck: "$3M" }
    },
    {
        _id: "static_7", name: "Andreessen Horowitz (a16z)", industry: "VC Firm", logo: "A",
        color: "from-slate-700 to-black", match: 90,
        desc: "Software is eating the world. We are looking for aggressively scaling platforms in Crypto, Bio, Healthcare, and Enterprise Tech.",
        tag: "Lead Investor", budget: "$5M - $20M Investment", region: "Silicon Valley",
        metrics: { invested: "$35B", portfolio: "800+", avgCheck: "$12M" }
    },
    {
        _id: "static_8", name: "Techstars", industry: "Accelerator", logo: "T",
        color: "from-emerald-300 to-green-500", match: 88,
        desc: "Global network that helps entrepreneurs succeed. We run 40+ mentorship-driven accelerator programs worldwide.",
        tag: "Accelerator", budget: "$120k Standard Deal", region: "Global (Multiple Cities)",
        metrics: { invested: "$850M", portfolio: "3,500+", avgCheck: "$120k" }
    }
];

// Data for empty/zero state visualizations to make the UI look alive even without real data
const ZERO_ANALYTICS = [
    { name: 'Mon', views: 0, interest: 0 }, { name: 'Tue', views: 12, interest: 2 }, 
    { name: 'Wed', views: 45, interest: 8 }, { name: 'Thu', views: 30, interest: 5 }, 
    { name: 'Fri', views: 60, interest: 15 }, { name: 'Sat', views: 85, interest: 22 }, 
    { name: 'Sun', views: 110, interest: 35 },
];

const MARKET_RADAR_DATA = [
    { subject: 'Tech Stack', A: 85, B: 60, fullMark: 100 },
    { subject: 'Market Size', A: 90, B: 75, fullMark: 100 },
    { subject: 'Traction', A: 30, B: 50, fullMark: 100 }, // Low traction for new startup
    { subject: 'Team', A: 80, B: 70, fullMark: 100 },
    { subject: 'Defensibility', A: 65, B: 85, fullMark: 100 },
];

// ==========================================
// 3. MAIN DASHBOARD COMPONENT
// ==========================================
export default function StartupDashboard() {
    // --- Context & Core State ---
    const auth = useAuth() || {};
    // Fallback user if auth context is missing
    const defaultUser = { name: "Krish Taliyan", companyName: "NearBites Gen2", email: "krish@nearbites.io" };
    const user = auth.user || defaultUser;
    const logout = auth.logout || (() => console.log("Logged out"));
    const updateUser = auth.updateUser || ((data) => console.log("Updated", data));
    
    // --- UI Navigation State ---
    const [view, setView] = useState("Home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState("Company Profile");
    
    // --- Data States (Zero State Architecture) ---
    const [myRequests, setMyRequests] = useState([]); // Pitches sent to investors
    const [directory, setDirectory] = useState(FEATURED_DIRECTORY);
    const [myBroadcasts, setMyBroadcasts] = useState([]); // Ideas broadcasted to network
    
    // --- Filters & Inputs ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    
    // Forms
    const [newBroadcast, setNewBroadcast] = useState({ title: "", ask: "", desc: "", arr: "", runway: "" });
    const [formData, setFormData] = useState({ 
        name: user.name || "", 
        companyName: user.companyName || "", 
        website: "https://",
        bio: "We are building a highly scalable MERN stack platform to revolutionize hyper-local delivery...",
        email: user.email || "",
        stage: "Pre-Seed"
    });

    // --- Modal States ---
    const [modalOpen, setModalOpen] = useState(false); // Transmit Modal
    const [detailsOpen, setDetailsOpen] = useState(false); // VC Details Modal
    const [selectedCorp, setSelectedCorp] = useState(null);
    const [pitch, setPitch] = useState("");
    const [toast, setToast] = useState(null);

    // --- Effects ---
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        
        // Populate initial forms if user exists
        if (user) {
            setFormData(prev => ({ 
                ...prev, name: user.name || "", companyName: user.companyName || "", email: user.email || ""
            }));
            fetchCorporates();
            fetchRequests();
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [user]);

    // Mock getToken
    const getToken = () => localStorage.getItem("cx_token") || "mock_token";

    // --- API & Logic Handlers ---
    const fetchCorporates = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/corporates", { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if(res.ok && Array.isArray(data)) {
                // Formatting real data to match our UI schema, then merging with static directory
                const realCorps = data.map(c => ({
                    _id: c._id, name: c.companyName || c.name, industry: c.industry || "Enterprise",
                    logo: c.companyName ? c.companyName[0] : "C", color: "from-slate-200 to-slate-300", 
                    match: 75, desc: c.innovationFocus || "Looking for innovation partners.", tag: c.department || "New Member",
                    budget: c.pilotBudget || "Undisclosed", region: "Global", metrics: { invested: "N/A", portfolio: "N/A", avgCheck: "N/A" }
                }));
                setDirectory([...FEATURED_DIRECTORY, ...realCorps]);
            }
        } catch(err) { console.log("Running in offline/demo mode with static directory."); }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/applications/sent", { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if(res.ok && data.length > 0) setMyRequests(data);
        } catch(err) { console.log("Running in offline/demo mode for requests."); }
    };

    const showToast = (msg, type="success") => {
        setToast({msg, type});
        setTimeout(() => setToast(null), 3500);
    };

    const getStatus = (receiverId) => {
        const req = myRequests.find(r => r.receiver === receiverId || r.targetId === receiverId);
        return req ? req.status : null;
    };

    const handleConnect = (corp) => {
        if(getStatus(corp._id)) return showToast("Pitch already in pipeline for this partner.", "error");
        setSelectedCorp(corp);
        setDetailsOpen(false); 
        setPitch(`Hi ${corp.name} team,\n\nWe are building a next-gen solution in the ${corp.industry} space and noticed your mandate for ${corp.tag}.\n\nOur platform utilizes...`);
        setModalOpen(true);
    };

    const handleViewDetails = (corp) => {
        setSelectedCorp(corp);
        setDetailsOpen(true);
    };

    const handleBroadcast = (e) => {
        e.preventDefault();
        const broadcast = { id: Date.now(), ...newBroadcast, date: new Date().toISOString().split('T')[0], views: 0 };
        setMyBroadcasts([broadcast, ...myBroadcasts]);
        setNewBroadcast({ title: "", ask: "", desc: "", arr: "", runway: "" });
        showToast("Fundraising Signal Broadcasted to Network");
        setView("Broadcast");
    };

    const submitPitch = async () => {
        if(!pitch.trim()) return showToast("Pitch document cannot be empty.", "error");
        
        const mockReq = {
            _id: "temp_" + Date.now(),
            targetId: selectedCorp._id,
            targetCompanyName: selectedCorp.name,
            message: pitch,
            status: "Sent",
            createdAt: new Date().toISOString()
        };
        setMyRequests([mockReq, ...myRequests]);
        setModalOpen(false);
        showToast(`Pitch Transmitted to ${selectedCorp.name}!`);

        try {
            if (!selectedCorp._id.startsWith("static")) {
                await fetch("http://localhost:5000/api/applications/send", {
                    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ receiverId: selectedCorp._id, targetCompanyName: selectedCorp.name, message: pitch })
                });
                fetchRequests(); 
            }
        } catch (err) {}
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        // updateUser(formData);
        showToast("Company Profile Updated Globally");
    };

    const filteredDirectory = useMemo(() => {
        return directory.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.desc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === "All" || (c.industry && c.industry.includes(filter)) || (c.tag && c.tag.includes(filter));
            return matchesSearch && matchesFilter;
        });
    }, [directory, searchTerm, filter]);

    // --- Custom Chart Tooltip ---
    const CustomAreaTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-xl font-sans">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label} Analytics</p>
                    <p className="text-emerald-600 font-black text-sm mb-1">{`Profile Views: ${payload[0].value}`}</p>
                    <p className="text-teal-600 font-black text-sm">{`Investor Interest: ${payload[1].value}`}</p>
                </div>
            );
        }
        return null;
    };

    // ==========================================
    // RENDER: SIDEBAR (Desktop & Mobile)
    // ==========================================
    const renderSidebar = () => (
        <>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-white/70 backdrop-blur-2xl border-r border-white/60 flex flex-col z-50 shadow-2xl lg:shadow-none`}>
                <div className="h-24 flex items-center justify-between px-8 border-b border-slate-200/60 bg-white/40">
                    <div className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
                        Founder<span className="text-emerald-500">Hub</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800">{ICONS.Close}</button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 scrollbar-hide">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Platform</div>
                        {[
                            {id:"Home", icon:ICONS.Home, label:"Command Center"},
                            {id:"Directory", icon:ICONS.Globe, label:"Partner Network"},
                            {id:"Broadcast", icon:ICONS.Broadcast, label:"Signal Fundraise"},
                            {id:"Requests", icon:ICONS.Send, label:"Active Pitches", badge: myRequests.length},
                        ].map(item => (
                            <button key={item.id} onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }} 
                                className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-all duration-300 border ${view === item.id ? "bg-white text-slate-800 border-slate-200 shadow-sm" : "border-transparent hover:bg-white/50 hover:text-slate-800 text-slate-500"}`}>
                                <span className="flex items-center gap-3">
                                    <span className={view === item.id ? "text-emerald-500" : ""}>{item.icon}</span> 
                                    <span className="tracking-tight">{item.label}</span>
                                </span>
                                {item.badge > 0 && <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-sm ${view === item.id ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{item.badge}</span>}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-2 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Administration</div>
                        <button onClick={() => { setView("Settings"); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-all border ${view === "Settings" ? "bg-white text-slate-800 border-slate-200 shadow-sm" : "border-transparent hover:bg-white/50 hover:text-slate-800 text-slate-500"}`}>
                            <span className="flex items-center gap-3">
                                <span className={view === "Settings" ? "text-emerald-500" : ""}>{ICONS.Cog}</span> Config & Profile
                            </span>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200/60 bg-white/40 mt-auto backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                            {formData.companyName ? formData.companyName[0] : "S"}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-black text-slate-800 truncate">{formData.companyName || "New Startup"}</div>
                            <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase truncate">{formData.name}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full py-3 bg-white/50 hover:bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:text-rose-500 transition-all shadow-sm hover:shadow-md uppercase tracking-widest">
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );

    // ==========================================
    // MAIN APP RENDER
    // ==========================================
    return (
        <div className="flex h-screen bg-[#FAFAFA] font-sans text-slate-600 overflow-hidden selection:bg-emerald-200 selection:text-emerald-900 relative">
            
            {/* --- Dynamic Aesthetic Background (Light Glassmorphism) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob"></div>
                <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] bg-rose-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-amber-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob animation-delay-4000"></div>
                {/* Dotted Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Global Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} 
                        className={`fixed top-6 right-1/2 translate-x-1/2 px-6 py-4 rounded-2xl z-[100] font-bold text-sm flex items-center gap-3 tracking-wide shadow-2xl ${toast.type === 'error' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                        <span className="bg-white/20 rounded-lg p-1">{toast.type === 'error' ? ICONS.Close : ICONS.CheckCircle}</span> 
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {renderSidebar()}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide flex flex-col">
                
                {/* Sticky Topbar */}
                <header className="min-h-[3rem] bg-white/50 backdrop-blur-xl border-b border-white/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 bg-white/50 rounded-xl">
                        {ICONS.Menu}
                    </button>
                    <div className="hidden lg:flex items-center gap-2">
                        <h1 className="text-sm font-black text-slate-800 tracking-tight uppercase italic">{view === 'Home' ? 'Startup Command' : view}</h1>
                    </div>
                    <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hidden sm:block">Network Uplink Active</p>
                    </div>
                </header>

                <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto pb-32 space-y-10">
                    
                    {/* ------------------------------------------- */}
                    {/* VIEW 1: HOME DASHBOARD (Optimized Zero State) */}
                    {/* ------------------------------------------- */}
                    {view === "Home" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{duration:0.4}} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            <div className="xl:col-span-2 space-y-8">
                                {/* Welcome Hero Banner */}
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-sm">
                                    {/* Decorative Blur */}
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none"></div>
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100 mb-4">
                                                <span className="text-xl">🚀</span> <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Initialized</span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Welcome, Founder.</h2>
                                            <p className="text-slate-600 max-w-lg text-sm font-medium mt-2 leading-relaxed">
                                                Your startup profile is currently visible to 480+ verified corporate partners and VCs. Update your data room to increase match rates.
                                            </p>
                                        </div>
                                        <button onClick={() => setView("Directory")} className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white font-black rounded-2xl hover:-translate-y-1 transition-transform shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                            {ICONS.Globe} Find Partners
                                        </button>
                                    </div>
                                </div>

                                {/* KPI Metrics */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                    <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                            Profile Views <span className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">{ICONS.Target}</span>
                                        </div>
                                        <div className="text-4xl font-black text-slate-800">124</div>
                                        <div className="text-[10px] text-emerald-600 mt-2 font-bold uppercase flex items-center gap-1">
                                            {ICONS.TrendingUp} +12% this week
                                        </div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                            Active Pitches <span className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg">{ICONS.Send}</span>
                                        </div>
                                        <div className="text-4xl font-black text-slate-800">{myRequests.length}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Awaiting responses</div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                            Sys Match Score <span className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">{ICONS.Rocket}</span>
                                        </div>
                                        <div className="text-4xl font-black text-slate-800">82<span className="text-2xl text-slate-400">%</span></div>
                                        <div className="text-[10px] text-amber-600 mt-2 font-bold uppercase">Action needed to improve</div>
                                    </div>
                                </div>

                                {/* Zero/Initial Data Chart: Engagement Velocity */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2.5rem] shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 uppercase italic">Engagement Velocity</h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Interactions (Trailing 7 Days)</p>
                                        </div>
                                        <div className="flex items-center gap-4 hidden sm:flex">
                                            <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Views</span>
                                            <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase"><div className="w-3 h-3 rounded-full bg-teal-400"></div> Interest</span>
                                        </div>
                                    </div>
                                    <div className="h-64 w-full relative">
                                        {/* Overlay for new accounts */}
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[2px] rounded-2xl border border-white">
                                            <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-xl flex items-center gap-3">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Gathering Initial Telemetry...</span>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={ZERO_ANALYTICS} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                                                <defs>
                                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient>
                                                    <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4}/><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/></linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                                                <RechartsTooltip content={<CustomAreaTooltip />} />
                                                <Area type="monotone" dataKey="views" stroke="#34d399" strokeWidth={3} fill="url(#colorViews)" activeDot={{r:6}} />
                                                <Area type="monotone" dataKey="interest" stroke="#2dd4bf" strokeWidth={3} fill="url(#colorInt)" activeDot={{r:6}} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Onboarding & Actions */}
                            <div className="space-y-8">
                                {/* Next Steps Checklist for Zero State */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm">
                                    <h3 className="text-lg font-black text-slate-800 uppercase italic mb-6">Setup Checklist</h3>
                                    <div className="space-y-4">
                                        {[
                                            { t: "Complete Company Profile", s: true },
                                            { t: "Upload Pitch Deck (PDF)", s: false },
                                            { t: "Verify Cap Table", s: false },
                                            { t: "Broadcast First Signal", s: myBroadcasts.length > 0 }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.s ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {item.s ? ICONS.CheckCircle : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                                                </div>
                                                <span className={`text-xs font-bold uppercase tracking-wide ${item.s ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.t}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={()=>setView("Settings")} className="w-full mt-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">Complete Profile</button>
                                </div>

                                {/* Market Fit Radar (Dummy Data for visual weight) */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center">
                                    <div className="text-center w-full mb-4">
                                        <h3 className="text-lg font-black text-slate-800 uppercase italic">Market Fit Analysis</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">You vs Industry Avg</p>
                                    </div>
                                    <div className="w-full h-56">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MARKET_RADAR_DATA}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="You" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                                <Radar name="Industry" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase"><div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500"></div> Your Startup</span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase"><div className="w-3 h-3 rounded bg-slate-300/40 border border-slate-400"></div> Industry Base</span>
                                    </div>
                                </div>

                                {/* Quick Broadcast Teaser */}
                                <div className="bg-emerald-600 rounded-[2.5rem] p-8 shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden group">
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <h3 className="text-xl font-black uppercase italic mb-2">Need Capital?</h3>
                                    <p className="text-emerald-100 text-sm font-medium mb-6">Alert the network that you are actively raising or looking for pilots.</p>
                                    <button onClick={()=>setView("Broadcast")} className="w-full py-4 bg-white text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg flex justify-center items-center gap-2">
                                        {ICONS.Broadcast} Signal Network
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 2: BROADCAST (Fundraising Form) */}
                    {/* ------------------------------------------- */}
                    {view === "Broadcast" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                            
                            {/* Form Side */}
                            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-sm h-fit">
                                <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Signal Network</h2>
                                <p className="text-sm text-slate-500 mb-8 font-medium">Post a specific ask (capital, pilots, partnerships) to the global feed.</p>
                                
                                <form onSubmit={handleBroadcast} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Signal Title</label>
                                        <input value={newBroadcast.title} onChange={e=>setNewBroadcast({...newBroadcast, title: e.target.value})} placeholder="e.g. Raising $2M Seed for MERN Platform" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 outline-none shadow-sm transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Ask</label>
                                            <input value={newBroadcast.ask} onChange={e=>setNewBroadcast({...newBroadcast, ask: e.target.value})} placeholder="$2,000,000" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 outline-none shadow-sm transition-all" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Current Runway</label>
                                            <input value={newBroadcast.runway} onChange={e=>setNewBroadcast({...newBroadcast, runway: e.target.value})} placeholder="14 Months" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 outline-none shadow-sm transition-all" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Current ARR (Optional)</label>
                                        <input value={newBroadcast.arr} onChange={e=>setNewBroadcast({...newBroadcast, arr: e.target.value})} placeholder="$150k" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 outline-none shadow-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Executive Summary</label>
                                        <textarea value={newBroadcast.desc} onChange={e=>setNewBroadcast({...newBroadcast, desc: e.target.value})} placeholder="Describe your traction, tech stack (e.g. MERN), and why you are raising..." className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 h-32 resize-none focus:border-emerald-500 outline-none shadow-sm transition-all" required />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl hover:-translate-y-1 transition-transform shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs">
                                        Broadcast Signal
                                    </button>
                                </form>
                            </div>

                            {/* List Side */}
                            <div className="lg:col-span-3 space-y-6">
                                <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-6">Active Broadcasts</h3>
                                {myBroadcasts.length === 0 ? (
                                    <div className="p-20 text-center text-slate-500 font-bold border-2 border-slate-200 border-dashed rounded-[2.5rem] bg-white/30 backdrop-blur-sm">
                                        You have no active signals in the network.
                                    </div>
                                ) : myBroadcasts.map((b, idx) => (
                                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: idx*0.1}} key={b.id} 
                                        className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] flex justify-between items-start group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex-1 pr-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="flex items-center gap-1.5 text-[9px] font-black bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Broadcasting
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.date}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight italic mb-2">{b.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{b.desc}</p>
                                            <div className="flex gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">ARR: {b.arr || "Pre-Revenue"}</span>
                                                <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">Runway: {b.runway}</span>
                                            </div>
                                        </div>
                                        <div className="text-right border-l border-slate-200 pl-8">
                                            <div className="text-3xl font-black text-slate-800">{b.ask}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-6">Target Ask</div>
                                            
                                            <div className="text-2xl font-black text-emerald-600">{b.views}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Corp Views</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 3: DIRECTORY (Investor & Partner Network) */}
                    {/* ------------------------------------------- */}
                    {view === "Directory" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tight italic">Partner Network</h2>
                                    <p className="text-sm text-slate-500 font-medium mt-2">Discover and pitch to 480+ verified VC firms and Corporate Innovation Hubs.</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">{ICONS.Globe}</div>
                                    <input type="text" placeholder="Search partners..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm transition-all" />
                                </div>
                            </header>

                            {/* Filters */}
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {["All", "VC Firm", "Accelerator", "Enterprise Partner", "AI & Data", "Fintech"].map(t => (
                                    <button key={t} onClick={() => setFilter(t)} 
                                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border backdrop-blur-md ${filter === t ? "bg-slate-800 text-white border-slate-700 shadow-xl shadow-slate-900/10 scale-105" : "bg-white/60 text-slate-500 border-white hover:bg-white hover:-translate-y-0.5 shadow-sm"}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                                {filteredDirectory.map((corp, i) => {
                                    const status = getStatus(corp._id);
                                    return (
                                        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.05}} key={corp._id} 
                                            className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] hover:bg-white transition-all cursor-pointer group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] flex flex-col h-full">
                                            
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${corp.color} flex items-center justify-center text-white font-black text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 italic`}>
                                                    {corp.logo}
                                                </div>
                                                
                                                {/* Match Score Circular indicator */}
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                            <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                            <path className="text-emerald-500" strokeDasharray={`${corp.match}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                        </svg>
                                                        <span className="absolute text-[10px] font-black text-slate-800">{corp.match}%</span>
                                                    </div>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Match</span>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter truncate group-hover:text-emerald-600 transition-colors">{corp.name}</h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="text-[9px] font-black text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">{corp.industry}</span>
                                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100">{corp.tag}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3 flex-grow">{corp.desc}</p>
                                            
                                            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/60 mt-auto">
                                                <button onClick={() => handleViewDetails(corp)} className="py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Details</button>
                                                <button disabled={!!status} onClick={() => handleConnect(corp)} className={`py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-1.5 ${status ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" : "bg-slate-800 text-white hover:bg-emerald-500 hover:shadow-emerald-500/20"}`}>
                                                    {status ? (status === 'Sent' ? "Pending" : status) : <>Pitch <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></>}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 4: REQUESTS (Active Transmissions Log) */}
                    {/* ------------------------------------------- */}
                    {view === "Requests" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[600px]">
                            <div className="p-8 md:p-10 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40">
                                <div>
                                    <h3 className="font-black text-slate-800 text-3xl uppercase tracking-tighter italic">Transmission Log</h3>
                                    <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Track the status of your outgoing pitch packets.</p>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-full text-[10px] font-black border border-emerald-200 tracking-widest shadow-sm">
                                    {myRequests.length} ACTIVE PITCHES
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
                                {myRequests.length === 0 ? (
                                    <div className="p-20 text-center flex flex-col items-center">
                                        <div className="text-6xl text-slate-300 mb-4">📤</div>
                                        <div className="text-xl font-black text-slate-800">No Pitches Sent</div>
                                        <p className="text-slate-500 font-medium mt-2">Head to the Partner Network to start engaging.</p>
                                    </div>
                                ) : myRequests.map(req => (
                                    <div key={req._id} className="p-8 hover:bg-white/80 flex flex-col md:flex-row justify-between md:items-center gap-6 group transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center font-black text-white text-2xl shadow-md uppercase italic group-hover:scale-105 transition-transform">
                                                {req.targetCompanyName ? req.targetCompanyName[0] : "C"}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 text-2xl uppercase tracking-tight group-hover:text-emerald-600 transition-colors italic">{req.targetCompanyName}</div>
                                                <div className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-2 uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 px-0 md:px-8">
                                            <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1 flex items-center gap-1.5">{ICONS.Info} Payload Snippet</div>
                                            <div className="text-sm text-slate-600 font-medium italic truncate max-w-lg bg-slate-50 p-3 rounded-xl border border-slate-100">"{req.message}"</div>
                                        </div>

                                        <div className="shrink-0 text-left md:text-right">
                                            <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2">Status</div>
                                            <span className={`inline-flex px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                req.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                                req.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                                'bg-amber-50 text-amber-600 border-amber-200'
                                            }`}>
                                                {req.status === 'Sent' ? 'Pending Review' : req.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 5: SYSTEM CONFIG & PROFILE */}
                    {/* ------------------------------------------- */}
                    {view === "Settings" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                            
                            {/* Tabs */}
                            <div className="md:col-span-1 space-y-2">
                                {["Company Profile", "Data Room", "Security"].map(tab => (
                                    <button key={tab} onClick={() => setSettingsTab(tab)} 
                                        className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${settingsTab === tab ? "bg-slate-800 text-white shadow-xl shadow-slate-900/10" : "text-slate-500 hover:bg-white/60 bg-transparent"}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="md:col-span-3 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                                <h3 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-200/60 pb-6 uppercase italic tracking-tighter">{settingsTab}</h3>
                                
                                {settingsTab === "Company Profile" && (
                                    <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl">
                                        <div className="flex items-center gap-6 mb-8 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                                            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-black shadow-lg italic">
                                                {formData.companyName ? formData.companyName[0] : "S"}
                                            </div>
                                            <div>
                                                <button type="button" className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider shadow-sm">Upload Logo</button>
                                                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide font-bold">Max size 2MB (JPG/PNG)</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Startup Name</label>
                                                <input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Funding Stage</label>
                                                <select value={formData.stage} onChange={e=>setFormData({...formData, stage:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm cursor-pointer appearance-none">
                                                    <option>Pre-Seed</option><option>Seed</option><option>Series A</option><option>Series B+</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Founder / Operator Name</label>
                                                <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Contact Email</label>
                                                <input value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">One-Line Bio / Mission</label>
                                            <textarea value={formData.bio} onChange={e=>setFormData({...formData, bio:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold h-24 resize-none focus:border-emerald-500 outline-none transition-all shadow-sm leading-relaxed" />
                                        </div>

                                        <button className="w-full md:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-white shadow-xl shadow-slate-900/10 tracking-widest uppercase text-xs transition-all transform hover:-translate-y-1">
                                            Save Profile
                                        </button>
                                    </form>
                                )}

                                {settingsTab === "Data Room" && (
                                    <div className="space-y-6">
                                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                                            <div className="text-emerald-500 mt-1">{ICONS.Shield}</div>
                                            <div>
                                                <h4 className="text-emerald-800 font-bold text-sm uppercase">Secure Vault</h4>
                                                <p className="text-xs text-emerald-600/80 font-medium mt-1 leading-relaxed">Documents uploaded here are only shared when you explicitly transmit a pitch to a corporate partner. They are AES-256 encrypted at rest.</p>
                                            </div>
                                        </div>
                                        
                                        {['Pitch Deck (Required)', 'Cap Table (Optional)', 'Financial Model (Optional)'].map((doc, idx) => (
                                            <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                                                <div>
                                                    <h4 className="text-slate-800 font-black text-sm uppercase">{doc}</h4>
                                                    <p className="text-xs text-slate-500 font-bold mt-1">PDF or Excel, Max 10MB</p>
                                                </div>
                                                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
                                                    {ICONS.Upload} Upload File
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {settingsTab === "Security" && (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">{ICONS.Lock}</div>
                                                <div>
                                                    <h4 className="text-slate-800 font-black text-sm uppercase">Two-Factor Authentication</h4>
                                                    <p className="text-xs text-slate-500 font-bold mt-1">Highly recommended for founders.</p>
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase hover:bg-slate-700 transition-all shadow-md">Enable 2FA</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ------------------------------------------- */}
                {/* MODALS (Transmit Pitch & Detail View) */}
                {/* ------------------------------------------- */}
                
                {/* 1. Transmit Pitch Modal */}
                <AnimatePresence>
                    {modalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
                            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                                className="bg-[#FAFAFA] border border-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
                                
                                <div className="p-8 md:p-10 border-b border-slate-200 bg-white relative">
                                    <button onClick={() => setModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 bg-slate-100 p-2 rounded-full transition-colors">{ICONS.Close}</button>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedCorp?.color || 'from-slate-800 to-slate-700'} flex items-center justify-center text-white text-2xl font-black italic shadow-lg`}>
                                            {selectedCorp?.logo}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Pitch to {selectedCorp?.name}</h2>
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Direct Partner Transmission</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8 md:p-10 bg-white/50">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Executive Message</label>
                                    <textarea value={pitch} onChange={e => setPitch(e.target.value)} 
                                        className="w-full h-48 bg-white border border-slate-200 rounded-2xl p-5 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none mb-6 font-medium text-sm leading-relaxed shadow-inner" 
                                        placeholder="Enter your pitch..." />
                                    
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button onClick={() => setModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 text-xs uppercase tracking-widest transition-colors shadow-sm">Abort</button>
                                        <button onClick={submitPitch} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-white shadow-xl shadow-emerald-500/20 text-xs uppercase tracking-widest transition-all flex justify-center items-center gap-2">
                                            {ICONS.Send} Transmit Pitch
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* 2. Partner Detail Modal */}
                <AnimatePresence>
                    {detailsOpen && selectedCorp && (
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
                            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                                className="bg-[#FAFAFA] border border-white w-full max-w-4xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                                
                                {/* Header Banner */}
                                <div className={`h-40 bg-gradient-to-r ${selectedCorp.color} relative shrink-0`}>
                                    <button onClick={() => setDetailsOpen(false)} className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 p-2.5 rounded-full text-white transition-colors backdrop-blur-md z-10">{ICONS.Close}</button>
                                    
                                    <div className="absolute -bottom-12 left-8 md:left-12 w-28 h-28 bg-white rounded-[1.5rem] p-2 shadow-xl">
                                        <div className={`w-full h-full bg-gradient-to-br ${selectedCorp.color} rounded-xl flex items-center justify-center text-4xl font-black text-white italic`}>
                                            {selectedCorp.logo}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Scrollable Body */}
                                <div className="flex-1 overflow-y-auto pt-16 px-8 md:px-12 pb-8 bg-white/60 backdrop-blur-xl">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6 border-b border-slate-200 pb-8">
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">{selectedCorp.name}</h2>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-600 tracking-widest border border-slate-200">{selectedCorp.industry}</span>
                                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">{selectedCorp.tag}</span>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right bg-white p-4 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
                                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Standard Budget / Check</div>
                                            <div className="text-2xl font-black text-emerald-600 tracking-tighter">{selectedCorp.budget}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        <div className="md:col-span-2 space-y-6">
                                            <section>
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Investment Thesis & Focus</h4>
                                                <p className="text-slate-600 leading-relaxed text-[15px] font-medium bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">{selectedCorp.desc}</p>
                                            </section>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Geographic Focus</div>
                                                    <div className="text-slate-800 font-black text-lg">{selectedCorp.region}</div>
                                                </div>
                                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Compatibility Score</div>
                                                    <div className="text-emerald-600 font-black text-lg">{selectedCorp.match}% Alignment</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="bg-slate-800 p-6 rounded-3xl text-white shadow-xl shadow-slate-900/10 h-full flex flex-col justify-center">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Firm Statistics</h4>
                                                <div className="space-y-5">
                                                    <div><div className="text-[10px] text-slate-400 uppercase font-bold">Capital Deployed</div><div className="text-xl font-black">{selectedCorp.metrics?.invested || 'N/A'}</div></div>
                                                    <div><div className="text-[10px] text-slate-400 uppercase font-bold">Portfolio Size</div><div className="text-xl font-black">{selectedCorp.metrics?.portfolio || 'N/A'}</div></div>
                                                    <div><div className="text-[10px] text-slate-400 uppercase font-bold">Avg Ticket Size</div><div className="text-xl font-black text-emerald-400">{selectedCorp.metrics?.avgCheck || 'N/A'}</div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-auto shrink-0">
                                        <button onClick={() => setDetailsOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest shadow-sm">Cancel</button>
                                        <button disabled={!!getStatus(selectedCorp._id)} onClick={() => handleConnect(selectedCorp)} 
                                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${getStatus(selectedCorp._id) ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"}`}>
                                            {getStatus(selectedCorp._id) ? "Pitch Pending Review" : <>{ICONS.Send} Prepare Pitch</>}
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