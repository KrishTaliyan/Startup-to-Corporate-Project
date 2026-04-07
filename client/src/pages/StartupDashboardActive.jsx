import React, { useState, useEffect, useMemo } from "react";
// Mock useAuth if it doesn't exist in your actual setup
import { useAuth } from "../Context/AuthContext";
import { 
    AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid,
    BarChart, Bar, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. MASSIVE ICON LIBRARY (Aesthetic Light Theme)
// ==========================================
const ICONS = {
    Menu: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Broadcast: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    Send: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    Cog: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Chart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    CheckCircle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Close: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    TrendingUp: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Info: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Upload: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
};

// ==========================================
// 2. MASSIVE MOCK DATA SUITE (ACTIVE STATE)
// ==========================================
const GROWTH_DATA = [
    { name: 'Jan', views: 2400, connections: 120, deals: 2 }, 
    { name: 'Feb', views: 4398, connections: 250, deals: 3 }, 
    { name: 'Mar', views: 6800, connections: 410, deals: 8 },
    { name: 'Apr', views: 5908, connections: 380, deals: 5 }, 
    { name: 'May', views: 8800, connections: 620, deals: 12 }, 
    { name: 'Jun', views: 11800, connections: 850, deals: 18 }, 
    { name: 'Jul', views: 14305, connections: 1105, deals: 24 },
];

const UPCOMING_MEETINGS = [
    { id: 1, title: "Series A Pitch Defense", partner: "Sequoia Capital", time: "Tomorrow, 10:00 AM", type: "Video Call", status: "Confirmed", color: "border-emerald-500" },
    { id: 2, title: "Tech Due Diligence", partner: "Tesla Energy Hub", time: "Thursday, 2:00 PM", type: "In-Person", status: "Preparation Req", color: "border-rose-500" },
    { id: 3, title: "Term Sheet Review", partner: "Legal Counsel", time: "Friday, 11:30 AM", type: "Audio Call", status: "Pending", color: "border-blue-500" },
    { id: 4, title: "Partner Architecture Sync", partner: "Google Cloud", time: "Monday, 9:00 AM", type: "Video Call", status: "Confirmed", color: "border-amber-500" },
];

const ACTIVE_DEALS = [
    { id: "d1", name: "Google Cloud", stage: "Term Sheet", amount: "$1.5M", status: "Reviewing", progress: 90, lastAction: "Received preliminary terms." },
    { id: "d2", name: "Microsoft Ventures", stage: "Partner Sync", amount: "$2M", status: "Scheduled", progress: 60, lastAction: "Architecture deep-dive next week." },
    { id: "d3", name: "Y Combinator", stage: "Final Interview", amount: "$500k", status: "Action Needed", progress: 75, lastAction: "Mock interviews scheduled." },
    { id: "d4", name: "Stripe", stage: "Grant App", amount: "$50k", status: "Pending", progress: 30, lastAction: "Submitted API integration architecture." },
];

const LIVE_MANDATES = [
    { id: 101, title: "Seeking AI-Driven Supply Chain Pilots", sector: "Logistics", budget: "$150k Pilot", postedBy: "Global Logistics Corp", time: "2h ago", match: 94, desc: "We are actively seeking early-stage startups utilizing Generative AI and RL to optimize warehouse routing. Guaranteed pilot for selected vendors.", reqs: ["MERN/Python", "API Ready", "GDPR Compliant"] },
    { id: 102, title: "Fintech Fraud Detection Series A Allocation", sector: "Fintech", budget: "$2.5M Invest", postedBy: "BankCorp Ventures", time: "5h ago", match: 72, desc: "Corporate VC arm is allocating $2.5M for a Series A lead in behavioral biometrics and fraud detection.", reqs: ["$500k+ ARR", "SOC2", "US/EU Focus"] },
    { id: 103, title: "Carbon Capture Hardware Innovation", sector: "CleanTech", budget: "$500k Grant", postedBy: "EcoEnergy Systems", time: "1d ago", match: 45, desc: "Open call for direct air capture prototypes ready for field testing in high-humidity environments.", reqs: ["Hardware MVP", "Patented/Pending"] },
    { id: 104, title: "Next-Gen EdTech LMS Platforms", sector: "EdTech", budget: "$1M Seed", postedBy: "EduFuture Fund", time: "2d ago", match: 88, desc: "Looking for localized, low-bandwidth SQL-based LMS solutions for developing nations.", reqs: ["React Frontend", "Offline Sync", "Active Users"] }
];

const FEATURED_DIRECTORY = [
    { _id: "static_1", name: "Google Cloud Startups", industry: "AI & Data", logo: "G", color: "from-blue-400 to-cyan-500", match: 98, desc: "Seeking GenAI solutions for Workspace integration. Offering massive compute credits and strategic investment.", tag: "Enterprise", budget: "$100k Pilot + Credits", region: "Global" },
    { _id: "static_2", name: "Tesla Energy", industry: "CleanTech", logo: "T", color: "from-red-500 to-rose-600", match: 85, desc: "Looking for battery optimization and manufacturing robotics. Hardware focus.", tag: "Active Now", budget: "$250k Pilot", region: "USA/Europe" },
    { _id: "static_3", name: "Sequoia Capital", industry: "VC Firm", logo: "S", color: "from-emerald-400 to-teal-500", match: 92, desc: "Series A/B funding for high-growth SaaS platforms. Looking for technical founders with extreme depth.", tag: "Investor", budget: "$2M - $10M", region: "Global" },
    { _id: "static_4", name: "Stripe", industry: "Fintech", logo: "S", color: "from-indigo-400 to-violet-500", match: 89, desc: "Payment infrastructure and billing automation tools. B2B focus.", tag: "B2B Focus", budget: "$50k Grant", region: "Remote" },
    { _id: "static_5", name: "BMW iVentures", industry: "Automotive", logo: "B", color: "from-sky-500 to-blue-600", match: 76, desc: "Next-gen cockpit UI and autonomous driving sensors.", tag: "Innovation Hub", budget: "$1.5M Seed", region: "Germany" },
    { _id: "static_6", name: "Y Combinator", industry: "Accelerator", logo: "Y", color: "from-orange-400 to-rose-500", match: 95, desc: "Accepting applications for the upcoming batch. Standard SAFE terms.", tag: "Accelerator", budget: "$500k SAFE", region: "San Francisco" },
];

const PRE_POPULATED_REQUESTS = [
    { _id: "req_1", targetCompanyName: "Microsoft Ventures", targetLogo: "M", message: "Attached is our Series A deck detailing our GenAI optimization layer for Azure. We've hit $1.2M ARR growing 15% MoM.", status: "In Review", statusColor: "text-blue-600 bg-blue-50 border-blue-200", createdAt: "2024-12-15" },
    { _id: "req_2", targetCompanyName: "Sequoia Capital", targetLogo: "S", message: "Following up on our partner meeting. Uploaded the revised financial model and Cap Table as requested.", status: "Action Required", statusColor: "text-rose-600 bg-rose-50 border-rose-200", createdAt: "2024-12-10" },
    { _id: "req_3", targetCompanyName: "Y Combinator", targetLogo: "Y", message: "W25 Batch Application Submitted. Founder video link is included in the payload.", status: "Pending", statusColor: "text-amber-600 bg-amber-50 border-amber-200", createdAt: "2024-12-22" },
    { _id: "req_4", targetCompanyName: "Google Cloud Startups", targetLogo: "G", message: "Applying for the advanced tier compute credits based on our new LLM training requirements.", status: "Accepted", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200", createdAt: "2024-11-05" }
];

const PRE_POPULATED_BROADCASTS = [
    { id: 1, title: "Series A - AI Logistics Platform", ask: "$2.5M Target", desc: "Optimizing last mile delivery with Reinforcement Learning. Currently operational in 3 major cities with $800k ARR. Raising to expand across Europe.", date: "2024-12-20", views: 342, clicks: 45, connects: 8 },
    { id: 2, title: "Seeking Corporate Design Partners", ask: "Zero Cost Pilots", desc: "We have built a proprietary vector database search engine. Looking for 3 enterprise partners to deploy in production environments.", date: "2024-11-15", views: 890, clicks: 120, connects: 15 }
];

// ==========================================
// 3. MAIN DASHBOARD COMPONENT
// ==========================================
export default function StartupDashboardActive() {
    // --- Context & Core State ---
    const auth = useAuth() || {};
    const defaultUser = { name: "Krish Taliyan", companyName: "NearBites Gen2", email: "krish@nearbites.io", tier: "Pro Partner" };
    const user = auth.user || defaultUser;
    const logout = auth.logout || (() => console.log("Logged out"));
    const updateUser = auth.updateUser || ((data) => console.log("Updated", data));
    
    const [view, setView] = useState("Home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- Dynamic Data States ---
    const [myRequests, setMyRequests] = useState(PRE_POPULATED_REQUESTS);
    const [directory, setDirectory] = useState(FEATURED_DIRECTORY);
    const [mandates, setMandates] = useState(LIVE_MANDATES);
    const [myBroadcasts, setMyBroadcasts] = useState(PRE_POPULATED_BROADCASTS);
    
    // --- Form & Filter States ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [newBroadcast, setNewBroadcast] = useState({ title: "", ask: "", desc: "", metrics: "" });
    const [settingsTab, setSettingsTab] = useState("Profile");
    const [formData, setFormData] = useState({ 
        name: user.name || "", companyName: user.companyName || "", email: user.email || "",
        bio: "Building hyper-local delivery solutions using advanced MERN architecture.", stage: "Series A", arr: "$800k"
    });

    // --- Modal States ---
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedCorp, setSelectedCorp] = useState(null);
    const [pitch, setPitch] = useState("");
    const [toast, setToast] = useState(null);

    // --- Initialization ---
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        
        const timer = setTimeout(() => setLoading(false), 1000);
        
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name || "", companyName: user.companyName || "", email: user.email || "" }));
            fetchCorporates();
        }
        return () => { clearTimeout(timer); window.removeEventListener('resize', handleResize); };
    }, [user]);

    const getToken = () => localStorage.getItem("cx_token") || "mock_token";

    // --- API & Logic Functions ---
    const fetchCorporates = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/corporates", { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if(res.ok && Array.isArray(data)) {
                const realCorps = data.map(c => ({
                    _id: c._id, name: c.companyName || c.name, industry: c.industry || "Enterprise",
                    logo: c.companyName ? c.companyName[0] : "C", color: "from-slate-200 to-slate-300", 
                    match: Math.floor(Math.random() * 30) + 60, desc: c.innovationFocus || "Looking for partners.",
                    tag: c.department || "New Member", budget: c.pilotBudget || "Undisclosed", region: "Global"
                }));
                setDirectory([...FEATURED_DIRECTORY, ...realCorps]);
            }
        } catch(err) { console.log("Running in offline/demo mode."); }
    };

    const showToast = (msg, type="success") => {
        setToast({msg, type});
        setTimeout(() => setToast(null), 3500);
    };

    const getStatus = (targetName) => {
        const req = myRequests.find(r => r.targetCompanyName === targetName);
        return req ? req.status : null;
    };

    // --- Interaction Handlers ---
    const handleConnect = (corp) => {
        if(getStatus(corp.name)) return showToast(`Pitch already active with ${corp.name}`, "error");
        setSelectedCorp(corp);
        setDetailsOpen(false);
        setPitch(`Hi ${corp.name} Innovation Team,\n\nWe align perfectly with your mandate for ${corp.tag}. Our platform utilizes...\n\nData Room is attached.`);
        setModalOpen(true);
    };

    const handleApplyToMandate = (id) => {
        const mandate = mandates.find(m => m.id === id);
        setMandates(prev => prev.filter(m => m.id !== id));
        showToast(`Application submitted to ${mandate.postedBy}!`);
    };

    const handleViewDetails = (corp) => {
        setSelectedCorp(corp);
        setDetailsOpen(true);
    };

    const handleBroadcast = (e) => {
        e.preventDefault();
        const broadcast = { id: Date.now(), ...newBroadcast, date: new Date().toISOString().split('T')[0], views: 0, clicks: 0, connects: 0 };
        setMyBroadcasts([broadcast, ...myBroadcasts]);
        setNewBroadcast({ title: "", ask: "", desc: "", metrics: "" });
        showToast("Signal Broadcasted to Global Feed!");
        setView("Broadcast");
    };

    const submitPitch = async () => {
        if(!pitch.trim()) return showToast("Transmission payload cannot be empty.", "error");
        
        const mockReq = {
            _id: "temp_" + Date.now(), targetCompanyName: selectedCorp.name, targetLogo: selectedCorp.logo,
            message: pitch, status: "Sent", statusColor: "text-slate-600 bg-slate-50 border-slate-200", createdAt: new Date().toISOString().split('T')[0]
        };
        setMyRequests([mockReq, ...myRequests]);
        setModalOpen(false);
        showToast(`Secure Transmission sent to ${selectedCorp.name}`);
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        showToast("System Protocol Updated Successfully");
    };

    const filteredDirectory = useMemo(() => {
        return directory.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.desc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === "All" || (c.industry && c.industry.includes(filter)) || (c.tag && c.tag.includes(filter));
            return matchesSearch && matchesFilter;
        });
    }, [directory, searchTerm, filter]);

    // --- Custom Recharts Tooltip ---
    const CustomAreaTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-xl font-sans">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label} Metrics</p>
                    <p className="text-emerald-600 font-black text-sm mb-1">{`Profile Views: ${payload[0].value}`}</p>
                    <p className="text-teal-600 font-black text-sm">{`Connections: ${payload[1].value}`}</p>
                </div>
            );
        }
        return null;
    };

    // ==========================================
    // RENDER: LOADING STATE
    // ==========================================
    if (loading) return (
        <div className="h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans">
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-[2rem] transform rotate-45"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-[2rem] border-t-transparent animate-spin"></div>
                <div className="text-emerald-500 font-black text-3xl italic">S</div>
            </div>
            <div className="text-slate-500 text-xs tracking-[0.3em] uppercase font-black animate-pulse">Initializing Startup.OS...</div>
        </div>
    );

    // ==========================================
    // RENDER: SIDEBAR (Mobile & Desktop)
    // ==========================================
    const renderSidebar = () => (
        <>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-white/70 backdrop-blur-2xl border-r border-white/60 flex flex-col z-50 shadow-2xl lg:shadow-none`}>
                <div className="h-24 flex items-center justify-between px-8 border-b border-slate-200/60 bg-white/40">
                    <div className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
                        Startup<span className="text-emerald-500">.OS</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800">{ICONS.Close}</button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Workspace</div>
                        {[
                            {id:"Home", icon:ICONS.Home, label:"Command Center"},
                            {id:"Directory", icon:ICONS.Globe, label:"Partner Network"},
                            {id:"Marketplace", icon:ICONS.Briefcase, label:"Live Mandates", badge: mandates.length},
                            {id:"Broadcast", icon:ICONS.Broadcast, label:"Signal Fundraise"},
                            {id:"Requests", icon:ICONS.Send, label:"Deal Pipeline", badge: myRequests.length},
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
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">System</div>
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
                            <div className="text-sm font-black text-slate-800 truncate">{formData.companyName}</div>
                            <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase truncate">{user.tier}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full py-3 bg-white/50 hover:bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:text-rose-500 transition-all shadow-sm hover:shadow-md uppercase tracking-widest">
                        Disconnect Node
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
                <header className="min-h-[4rem] bg-white/50 backdrop-blur-xl border-b border-white/60 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 bg-white/50 rounded-xl">
                            {ICONS.Menu}
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase italic">{view === 'Home' ? 'Active Dashboard' : view}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <p className="text-[9px] md:text-[10px] text-emerald-600 font-black uppercase tracking-widest">Network Uplink Active</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:flex px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest shadow-sm">
                            Seed Round: In Progress
                        </div>
                        <div className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 cursor-pointer relative transition-all">
                            {ICONS.Bell}
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-10 lg:p-12 max-w-[1600px] w-full mx-auto pb-32 space-y-10">
                    
                    {/* ------------------------------------------- */}
                    {/* VIEW 1: HOME (ACTIVE DASHBOARD) */}
                    {/* ------------------------------------------- */}
                    {view === "Home" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{duration:0.4}} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            <div className="xl:col-span-2 space-y-8">
                                
                                {/* High-Level KPI Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                    {[
                                        { l: 'Total Impressions', v: '14,305', s: '↑ 12% vs last week', c: 'text-blue-500', bg: 'bg-blue-50', i: ICONS.TrendingUp },
                                        { l: 'Investor Interest', v: '24', s: 'Active Conversations', c: 'text-emerald-500', bg: 'bg-emerald-50', i: ICONS.Globe },
                                        { l: 'Pipeline Value', v: '$4.5M', s: 'Targeted Allocation', c: 'text-amber-500', bg: 'bg-amber-50', i: ICONS.Chart }
                                    ].map((k, i) => (
                                        <div key={i} className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k.l}</div>
                                                <div className={`p-2 rounded-xl ${k.bg} ${k.c}`}>{k.i}</div>
                                            </div>
                                            <div className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">{k.v}</div>
                                            <div className={`text-[10px] mt-2 font-bold uppercase ${k.c}`}>{k.s}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Active Growth Chart */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 uppercase italic">Profile & Network Traction</h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trailing 7 Months (YTD)</p>
                                        </div>
                                        <select className="bg-white border border-slate-200 text-xs font-black text-slate-600 px-4 py-2.5 rounded-xl outline-none shadow-sm cursor-pointer uppercase tracking-widest">
                                            <option>All Time</option>
                                            <option>Last 6 Months</option>
                                        </select>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={GROWTH_DATA} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                                                <defs>
                                                    <linearGradient id="colorViewsAct" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                                                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                                                <RechartsTooltip content={<CustomAreaTooltip />} />
                                                <Area yAxisId="left" type="monotone" dataKey="views" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorViewsAct)" activeDot={{r:6}} />
                                                <Line yAxisId="right" type="monotone" dataKey="connections" stroke="#0ea5e9" strokeWidth={3} dot={{r:4, fill:"#0ea5e9"}} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex gap-6 mt-6 justify-center">
                                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Page Views</span>
                                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="w-3 h-3 rounded-full bg-sky-500"></div> Network Connections</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Calendar & Pipeline */}
                            <div className="space-y-8">
                                
                                {/* Calendar Widget */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-black text-slate-800 uppercase italic">Upcoming Syncs</h3>
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">{ICONS.Calendar}</div>
                                    </div>
                                    <div className="space-y-4">
                                        {UPCOMING_MEETINGS.map(m => (
                                            <div key={m.id} className={`flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 ${m.color}`}>
                                                <div className="text-center w-16 shrink-0 flex flex-col justify-center border-r border-slate-100 pr-4">
                                                    <div className="text-xs font-black text-slate-800 uppercase leading-tight">{m.time.split(',')[0]}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1">{m.time.split(',')[1]}</div>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{m.title}</div>
                                                    <div className="text-xs font-bold text-slate-500 mt-1">{m.partner} • {m.type}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Deal Pipeline */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-black text-slate-800 uppercase italic">Deal Pipeline</h3>
                                        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View All</button>
                                    </div>
                                    <div className="space-y-6">
                                        {ACTIVE_DEALS.map(d => (
                                            <div key={d.id} className="group">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-sm italic">{d.name[0]}</div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{d.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.stage}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-black text-emerald-600">{d.amount}</div>
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{d.status}</div>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                                                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${d.progress}%`}}></div>
                                                </div>
                                                <div className="text-[10px] font-medium text-slate-500 italic">Action: {d.lastAction}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 2: DIRECTORY (Partner Network) */}
                    {/* ------------------------------------------- */}
                    {view === "Directory" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tight italic">Partner Network</h2>
                                    <p className="text-sm text-slate-500 font-medium mt-2">Discover and pitch directly to highly matched VCs and Corporate Hubs.</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">{ICONS.Search}</div>
                                    <input type="text" placeholder="Search partners..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm transition-all" />
                                </div>
                            </header>

                            {/* Filters */}
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {["All", "VC Firm", "Accelerator", "Enterprise", "AI & Data", "Fintech"].map(t => (
                                    <button key={t} onClick={() => setFilter(t === "All" ? "" : t)} 
                                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border backdrop-blur-md shadow-sm ${filter === (t==="All"?"":t) ? "bg-slate-800 text-white border-slate-700 scale-105" : "bg-white/60 text-slate-500 border-white hover:bg-white hover:-translate-y-0.5"}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {filteredDirectory.map((corp, i) => {
                                    const status = getStatus(corp.name);
                                    return (
                                        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.05}} key={corp._id} 
                                            className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] hover:bg-white transition-all cursor-pointer group hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full shadow-sm relative overflow-hidden">
                                            
                                            {/* Status Overlay Ribbon */}
                                            {status && (
                                                <div className="absolute top-4 right-[-30px] bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest py-1 px-10 transform rotate-45 shadow-md">
                                                    Active
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${corp.color} flex items-center justify-center text-white font-black text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 italic`}>
                                                    {corp.logo}
                                                </div>
                                                <div className="flex flex-col items-end pr-2">
                                                    <div className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{corp.match}%</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Match</div>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter truncate">{corp.name}</h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="text-[9px] font-black text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">{corp.industry}</span>
                                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100">{corp.tag}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3 flex-grow">{corp.desc}</p>
                                            
                                            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/60 mt-auto">
                                                <button onClick={() => handleViewDetails(corp)} className="py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Profile</button>
                                                <button disabled={!!status} onClick={() => handleConnect(corp)} className={`py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-1.5 ${status ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" : "bg-slate-800 text-white hover:bg-emerald-500 hover:shadow-emerald-500/20"}`}>
                                                    {status ? "Pitch Sent" : <>Pitch {ICONS.Send}</>}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 3: MARKETPLACE (Live Mandates) */}
                    {/* ------------------------------------------- */}
                    {view === "Marketplace" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100 rounded-[2.5rem] p-8 md:p-12 mb-8 relative overflow-hidden shadow-sm">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none"></div>
                                <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic relative z-10">Live Marketplace</h2>
                                <p className="text-slate-600 text-sm mt-3 max-w-2xl font-medium relative z-10 leading-relaxed">
                                    Direct mandates posted by corporate partners. These are active solicitations for pilots, investment, or technical partnerships. Apply to bypass standard screening.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {mandates.map((post, idx) => (
                                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: idx*0.05}} key={post.id} 
                                        className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] hover:shadow-xl transition-all group flex flex-col shadow-sm">
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100">{post.time}</div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors uppercase tracking-tight italic line-clamp-2">{post.title}</h3>
                                        
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">{post.postedBy}</span>
                                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">{post.sector}</span>
                                        </div>
                                        
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-grow">{post.desc}</p>
                                        
                                        <div className="mb-8 space-y-2">
                                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirements</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {post.reqs.map((req, i) => (
                                                    <span key={i} className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">{ICONS.CheckCircle} {req}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-6 mt-auto">
                                            <div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pilot/Budget Cap</div>
                                                <div className="text-slate-800 font-black text-xl tracking-tighter">{post.budget}</div>
                                            </div>
                                            <button onClick={() => handleApplyToMandate(post.id)} className="bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center gap-2">
                                                Apply {ICONS.Send}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 4: BROADCAST (Fundraising Form) */}
                    {/* ------------------------------------------- */}
                    {view === "Broadcast" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                            
                            {/* Left: Form */}
                            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-sm h-fit relative overflow-hidden">
                                <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Broadcast Signal</h2>
                                <p className="text-sm text-slate-500 mb-8 font-medium">Post your fundraising round or pilot requirements to the global investor feed.</p>
                                
                                <form onSubmit={handleBroadcast} className="space-y-6 relative z-10">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Signal Title</label>
                                        <input value={newBroadcast.title} onChange={e=>setNewBroadcast({...newBroadcast, title: e.target.value})} placeholder="e.g. Raising $2.5M Seed for Logistics AI" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Ask</label>
                                            <input value={newBroadcast.ask} onChange={e=>setNewBroadcast({...newBroadcast, ask: e.target.value})} placeholder="$2,500,000" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Key Metric (ARR/Users)</label>
                                            <input value={newBroadcast.metrics} onChange={e=>setNewBroadcast({...newBroadcast, metrics: e.target.value})} placeholder="$800k ARR" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Executive Pitch</label>
                                        <textarea value={newBroadcast.desc} onChange={e=>setNewBroadcast({...newBroadcast, desc: e.target.value})} placeholder="Describe traction, tech stack, and raise purpose..." className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 h-32 resize-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm leading-relaxed" required />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl uppercase text-xs tracking-widest transition-all shadow-xl shadow-slate-900/10 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                        {ICONS.Broadcast} Transmit to Network
                                    </button>
                                </form>
                            </div>

                            {/* Right: Active Broadcasts List */}
                            <div className="lg:col-span-3 space-y-6">
                                <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-6">Your Active Signals</h3>
                                
                                {myBroadcasts.map((b, idx) => (
                                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: idx*0.1}} key={b.id} 
                                        className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
                                        
                                        <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 pb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1.5 text-[9px] font-black bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.date}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-slate-800 tracking-tighter">{b.ask}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Target Ask</div>
                                            </div>
                                        </div>
                                        
                                        <h4 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight italic mb-3">{b.title}</h4>
                                        <p className="text-sm text-slate-600 font-medium line-clamp-2 mb-8 leading-relaxed">{b.desc}</p>
                                        
                                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 bg-white/40 p-4 rounded-2xl border border-white">
                                            <div className="text-center border-r border-slate-200 last:border-0">
                                                <div className="text-xl font-black text-slate-800">{b.views}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Views</div>
                                            </div>
                                            <div className="text-center border-r border-slate-200 last:border-0">
                                                <div className="text-xl font-black text-slate-800">{b.clicks}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Deck Clicks</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xl font-black text-emerald-600">{b.connects}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Inbound Pitch</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 5: REQUESTS (Deal Pipeline) */}
                    {/* ------------------------------------------- */}
                    {view === "Requests" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[600px]">
                            
                            {/* Header */}
                            <div className="p-8 md:p-10 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40">
                                <div>
                                    <h3 className="font-black text-slate-800 text-3xl uppercase tracking-tighter italic">Outbound Pipeline</h3>
                                    <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Track your pitches to VC firms and Enterprise Partners.</p>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-full text-[10px] font-black border border-emerald-200 tracking-widest shadow-sm">
                                    {myRequests.length} ACTIVE LOGS
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
                                {myRequests.map(req => (
                                    <div key={req._id} className="p-8 hover:bg-white/80 flex flex-col md:flex-row justify-between md:items-center gap-8 group transition-colors">
                                        
                                        <div className="flex items-center gap-6 md:w-1/3">
                                            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center font-black text-white text-2xl shadow-md uppercase italic group-hover:scale-105 transition-transform shrink-0">
                                                {req.targetLogo || (req.targetCompanyName ? req.targetCompanyName[0] : "C")}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 text-xl uppercase tracking-tight group-hover:text-emerald-600 transition-colors italic">{req.targetCompanyName}</div>
                                                <div className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-2 uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> {req.createdAt}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 px-0 md:px-8">
                                            <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2 flex items-center gap-1.5">{ICONS.Info} Payload Snippet</div>
                                            <div className="text-sm text-slate-600 font-medium italic line-clamp-2 max-w-lg bg-white p-4 rounded-xl border border-slate-100 shadow-sm leading-relaxed">
                                                "{req.message}"
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-left md:text-right flex flex-col items-start md:items-end justify-center min-w-[150px]">
                                            <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2">Current Status</div>
                                            <span className={`inline-flex px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${req.statusColor}`}>
                                                {req.status}
                                            </span>
                                            <button className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-600 hover:underline">Update Stage</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 6: SYSTEM SETTINGS & CONFIG */}
                    {/* ------------------------------------------- */}
                    {view === "Settings" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                            
                            {/* Tabs Sidebar */}
                            <div className="md:col-span-1 space-y-2">
                                {["Profile", "Data Room", "Billing", "Security"].map(tab => (
                                    <button key={tab} onClick={() => setSettingsTab(tab)} 
                                        className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${settingsTab === tab ? "bg-slate-800 text-white" : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-white"}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Forms Container */}
                            <div className="md:col-span-3 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-sm">
                                <h3 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-200/60 pb-6 uppercase italic tracking-tighter flex items-center gap-3">
                                    {settingsTab} Configuration
                                </h3>
                                
                                {settingsTab === "Profile" && (
                                    <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                            <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-black shadow-lg italic shrink-0">
                                                {formData.companyName ? formData.companyName[0] : "S"}
                                            </div>
                                            <div>
                                                <button type="button" className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider shadow-sm flex items-center gap-2">
                                                    {ICONS.Upload} Upload Startup Logo
                                                </button>
                                                <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wide font-bold">Square Image • Max size 2MB (JPG/PNG)</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Startup Entity Name</label>
                                                <input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Funding Stage</label>
                                                <select value={formData.stage} onChange={e=>setFormData({...formData, stage:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm cursor-pointer appearance-none">
                                                    <option>Pre-Seed</option><option>Seed</option><option>Series A</option><option>Series B+</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lead Operator / Founder</label>
                                                <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Email Node</label>
                                                <input value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Verified ARR</label>
                                                <input value={formData.arr} onChange={e=>setFormData({...formData, arr:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Website URL</label>
                                                <input value={formData.website} onChange={e=>setFormData({...formData, website:e.target.value})} placeholder="https://" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/10" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mission / Bio</label>
                                            <textarea value={formData.bio} onChange={e=>setFormData({...formData, bio:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-bold h-32 resize-none focus:border-emerald-500 outline-none transition-all shadow-sm leading-relaxed focus:ring-4 focus:ring-emerald-500/10" />
                                        </div>

                                        <div className="pt-6 border-t border-slate-200/60 flex justify-end">
                                            <button className="w-full md:w-auto px-12 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-white shadow-xl shadow-slate-900/10 tracking-widest uppercase text-xs transition-all transform hover:-translate-y-1">
                                                Commit Changes
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {settingsTab === "Data Room" && (
                                    <div className="space-y-6">
                                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-start gap-4 mb-8">
                                            <div className="text-emerald-500 mt-1">{ICONS.Shield}</div>
                                            <div>
                                                <h4 className="text-emerald-800 font-black text-sm uppercase">Secure Vault Enabled</h4>
                                                <p className="text-xs text-emerald-600/80 font-medium mt-1 leading-relaxed">Documents uploaded to your Data Room are AES-256 encrypted at rest. They are only decrypted and shared when you explicitly transmit a pitch to a partner.</p>
                                            </div>
                                        </div>
                                        
                                        {[
                                            { title: 'Executive Pitch Deck', req: true, stat: 'Uploaded (v2.1.pdf)' }, 
                                            { title: 'Capitalization Table', req: false, stat: 'Action Needed' }, 
                                            { title: 'Trailing 12m Financials', req: false, stat: 'Action Needed' }
                                        ].map((doc, idx) => (
                                            <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm group hover:border-emerald-200 transition-colors">
                                                <div>
                                                    <h4 className="text-slate-800 font-black text-sm uppercase tracking-tight flex items-center gap-2">
                                                        {doc.title} {doc.req && <span className="text-[9px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded uppercase tracking-widest">Req</span>}
                                                    </h4>
                                                    <p className={`text-xs font-bold mt-2 uppercase tracking-widest ${doc.stat.includes('Uploaded') ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        Status: {doc.stat}
                                                    </p>
                                                </div>
                                                <button className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm flex items-center justify-center gap-2 shrink-0">
                                                    {ICONS.Upload} {doc.stat.includes('Uploaded') ? 'Update File' : 'Upload'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ------------------------------------------- */}
                {/* MODALS: Transmit Pitch & Details */}
                {/* ------------------------------------------- */}
                
                {/* 1. Transmit Pitch Modal */}
                <AnimatePresence>
                    {modalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
                            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                                className="bg-[#FAFAFA] border border-white w-full max-w-3xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
                                
                                <div className="p-8 md:p-10 border-b border-slate-200 bg-white relative">
                                    <button onClick={() => setModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 bg-slate-100 p-2 rounded-full transition-colors">{ICONS.Close}</button>
                                    <div className="flex items-center gap-6">
                                        <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${selectedCorp?.color || 'from-slate-800 to-slate-700'} flex items-center justify-center text-white text-4xl font-black italic shadow-lg shrink-0`}>
                                            {selectedCorp?.logo}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Direct Transmission
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter truncate">Pitch {selectedCorp?.name}</h2>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8 md:p-10 bg-white/50">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Executive Message Payload</label>
                                    <textarea value={pitch} onChange={e => setPitch(e.target.value)} 
                                        className="w-full h-48 bg-white border border-slate-200 rounded-2xl p-5 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none mb-6 font-medium text-sm leading-relaxed shadow-inner" 
                                        placeholder="Enter your pitch..." />
                                    
                                    <div className="flex items-center gap-2 mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <div className="text-emerald-500">{ICONS.Shield}</div>
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Data Room Attached Automatically</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button onClick={() => setModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 text-xs uppercase tracking-widest transition-colors shadow-sm">Abort Connection</button>
                                        <button onClick={submitPitch} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-white shadow-xl shadow-emerald-500/20 text-xs uppercase tracking-widest transition-all flex justify-center items-center gap-2 active:scale-95">
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
                                        <button onClick={() => setDetailsOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest shadow-sm">Close Profile</button>
                                        <button disabled={!!getStatus(selectedCorp.name)} onClick={() => handleConnect(selectedCorp)} 
                                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${getStatus(selectedCorp.name) ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95"}`}>
                                            {getStatus(selectedCorp.name) ? "Pitch Already in Pipeline" : <>{ICONS.Send} Prepare Pitch</>}
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