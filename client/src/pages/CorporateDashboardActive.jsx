import React, { useState, useEffect, useMemo } from "react";
// Mock useAuth if it doesn't exist in your setup
import { useAuth } from "../Context/AuthContext";
import { 
    AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis,
    CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. MASSIVE ICON LIBRARY (Aesthetic Light Theme)
// ==========================================
const ICONS = {
    Menu: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Inbox: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>,
    History: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Post: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Check: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
    X: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    FileText: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    TrendingUp: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
};

// ==========================================
// 2. MASSIVE MOCK DATA SUITE
// ==========================================
const PERFORMANCE_DATA = [
    { name: "2024-Q1", value: 12.5, flow: 400, returns: 2.1 },
    { name: "2024-Q2", value: 14.2, flow: 350, returns: 3.4 },
    { name: "2024-Q3", value: 13.8, flow: 500, returns: 2.8 },
    { name: "2024-Q4", value: 21.5, flow: 750, returns: 6.5 },
    { name: "2025-Q1", value: 28.1, flow: 850, returns: 8.2 },
    { name: "2025-Q2", value: 34.8, flow: 1200, returns: 12.4 },
];

const ALLOCATION_DATA = [
    { name: "AI & DeepTech", value: 45, color: "#10b981", risk: "High" },
    { name: "Fintech Core", value: 30, color: "#0ea5e9", risk: "Medium" },
    { name: "Enterprise SaaS", value: 15, color: "#f59e0b", risk: "Low" },
    { name: "ClimateTech", value: 10, color: "#8b5cf6", risk: "Medium" },
];

const INITIAL_SUGGESTIONS = [
    { id: "s1", name: "NeuroLink Pro", industry: "NeuroTech", stage: "Series A", ask: "$15.5M", match: 98, founder: "Dr. Aris V.", connected: false, desc: "Non-invasive BCI for enterprise productivity and medical diagnostics." },
    { id: "s2", name: "CarbonShield", industry: "ClimateTech", stage: "Seed", ask: "$2.8M", match: 94, founder: "S. Varma", connected: false, desc: "Direct air capture units scaled for commercial HVAC systems." },
    { id: "s3", name: "QuantumSafe", industry: "Cybersecurity", stage: "Series B", ask: "$22M", match: 91, founder: "L. Chen", connected: false, desc: "Post-quantum encryption infrastructure for banking mainframes." },
    { id: "s4", name: "NearBites Gen2", industry: "FoodTech", stage: "Series A", ask: "$4.5M", match: 89, founder: "K. Taliyan", connected: false, desc: "MERN-based hyper-local aggregator with predictive AI routing." },
    { id: "s5", name: "EduCore Cloud", industry: "EdTech", stage: "Seed", ask: "$1.2M", match: 88, founder: "Prof. Davis", connected: false, desc: "SQL-optimized localized LMS for low-bandwidth institutional learning." },
    { id: "s6", name: "AeroDyne", industry: "SpaceTech", stage: "Pre-Seed", ask: "$850k", match: 82, founder: "M. Sterling", connected: false, desc: "LEO debris clearing autonomous drones with magnetic tethering." }
];

const MOCK_INBOX_REQUESTS = [
    { 
        _id: "m1", 
        startupName: "Hyperion AI", 
        senderEmail: "founders@hyperion.ai", 
        message: "Pitching our Series B lead allocation. We have scaled our enterprise LLM supply chain optimizer to 4 Fortune 500 clients. Attached is our term sheet for the $12M round. Our current burn is highly optimized due to custom silicon inferencing.", 
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
        status: "Pending",
        metrics: { arr: "$2.4M", growth: "18% MoM", runway: "14 Months", capValuation: "$65M" }
    },
    { 
        _id: "m2", 
        startupName: "FinMesh", 
        senderEmail: "ceo@finmesh.network", 
        message: "Saw your active mandate for cross-border B2B pilots. We have a working layer-2 solution that settles in 3 seconds. Seeking $1.5M Seed to acquire MSB licenses in Europe.", 
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), 
        status: "Pending",
        metrics: { arr: "$150k", growth: "45% MoM", runway: "8 Months", capValuation: "$12M" }
    },
    { 
        _id: "m3", 
        startupName: "MediCore Robotics", 
        senderEmail: "dr.smith@medicore.med", 
        message: "We are closing our Series C in 3 weeks. Looking for a strategic partner to fill the remaining $5M allocation. FDA approval for cardiac procedures secured last month.", 
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), 
        status: "Pending",
        metrics: { arr: "$14.5M", growth: "85% YoY", runway: "36 Months", capValuation: "$450M" }
    }
];

const MOCK_HISTORICAL_LOGS = [
    { id: 901, name: "BioGenix", status: "Rejected", date: "2024-12-10", reason: "Market Saturation & High CAC" },
    { id: 902, name: "Stripe", status: "Accepted", date: "2024-11-05", reason: "Follow-on investment (Pro-rata)" },
    { id: 903, name: "CloudScale", status: "Accepted", date: "2024-10-22", reason: "Strong infrastructure alignment" },
    { id: 904, name: "GreenVolt", status: "Accepted", date: "2024-09-15", reason: "Patented solid-state battery tech" },
    { id: 905, name: "CryptoSwap", status: "Rejected", date: "2024-08-30", reason: "Regulatory concerns in target market" },
    { id: 906, name: "EduCore Base", status: "Accepted", date: "2024-07-12", reason: "High MERN stack competency" },
];

const INITIAL_POSTS = [
    { id: 101, title: "AI-driven Supply Chain Pilots", sector: "Logistics / AI", budget: "$150k Pilot", applicants: 12, timestamp: "2024-12-24", desc: "Looking for late-seed startups with deployable LLMs for inventory prediction." },
    { id: 102, title: "Solid State Battery Infrastructure", sector: "CleanTech", budget: "$2M Allocation", applicants: 4, timestamp: "2025-01-10", desc: "Strategic mandate to fund EV battery supply chains." }
];

// ==========================================
// 3. MAIN DASHBOARD COMPONENT
// ==========================================
export default function CorporateDashboardActive() {
    // --- Context & Core State ---
    const auth = useAuth() || {};
    const defaultUser = { name: "Krish Taliyan", companyName: "Nexus Capital Partners", email: "ktaliyan@nexus.vc" };
    const user = auth.user || defaultUser;
    const logout = auth.logout || (() => console.log("Logged out"));
    const updateUser = auth.updateUser || ((data) => console.log("Updated", data));

    const [view, setView] = useState("Dashboard");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // --- Sub-View States ---
    const [settingsTab, setSettingsTab] = useState("General");
    const [selectedDeal, setSelectedDeal] = useState(null); // For detailed modal in Inbox

    // --- Data States ---
    const [requests, setRequests] = useState(MOCK_INBOX_REQUESTS);
    const [myPosts, setMyPosts] = useState(INITIAL_POSTS);
    const [newPost, setNewPost] = useState({ title: "", sector: "", budget: "", description: "" });
    const [history, setHistory] = useState(MOCK_HISTORICAL_LOGS);
    const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
    
    // --- Config State ---
    const [formData, setFormData] = useState({ 
        name: user.name || "", 
        companyName: user.companyName || "", 
        thesis: "MERN Stack, AI, & DeepTech", 
        checkSize: "$500k - $2M",
        emailNotifications: true,
        autoDecline: false
    });

    // --- Effects ---
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        
        // Simulate initial loading
        const timer = setTimeout(() => setLoading(false), 1200);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // --- Handlers ---
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
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
        showToast("Mandate Published to Startup Network");
        setView("CreatePost"); // stay on view
    };

    const handleConnect = (startup) => {
        if (startup.connected) return;
        setSuggestions(prev => prev.map(s => s.id === startup.id ? { ...s, connected: true } : s));
        const outboundDeal = {
            _id: `outbound_${Date.now()}`,
            startupName: startup.name,
            senderEmail: `hq@${startup.name.toLowerCase().replace(" ", "")}.io`,
            message: `SYSTEM LOG: Automated outbound mandate initiated based on thesis alignment. Match Score: ${startup.match}%`,
            createdAt: new Date().toISOString(),
            status: "Pending",
            metrics: { arr: "N/A", growth: "N/A", runway: "TBD", capValuation: startup.ask }
        };
        setRequests(prev => [outboundDeal, ...prev]);
        showToast(`Outbound Mandate sent to ${startup.name}`);
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
                reason: status === "Accepted" ? "Thesis Aligned & Cleared DD" : "Screened Out during Review"
            }, ...prev]);
        }
        setSelectedDeal(null);
        showToast(status === "Accepted" ? `Deal Added to Portfolio` : `Deal Archived`);
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        // updateUser(formData);
        showToast("System Protocol & Preferences Updated");
    };

    // --- Custom Chart Tooltip ---
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-xl font-sans">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-emerald-600 font-black text-xl">{`$${payload[0].value}M NAV`}</p>
                    {payload[0].payload.flow && (
                        <p className="text-slate-600 text-xs font-bold mt-1">Deal Flow: {payload[0].payload.flow} units</p>
                    )}
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
            <div className="relative w-20 h-20 flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="text-emerald-500 font-black text-xl italic">N</div>
            </div>
            <div className="text-slate-500 text-xs tracking-[0.3em] uppercase font-black animate-pulse">Initializing Nexus Console...</div>
        </div>
    );

    // ==========================================
    // RENDER: SIDEBAR
    // ==========================================
    const renderSidebar = () => (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-white/70 backdrop-blur-2xl border-r border-white/60 flex flex-col z-50 shadow-2xl md:shadow-none`}>
                <div className="h-24 flex items-center justify-between px-8 border-b border-slate-200/60 bg-white/40">
                    <div className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
                        Nexus<span className="text-emerald-500">VC</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800">{ICONS.X}</button>
                </div>
                
                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                    {[
                        { id: "Dashboard", label: "Overview", icon: ICONS.Dashboard },
                        { id: "Inbox", label: "Deal Pipeline", icon: ICONS.Inbox, badge: requests.length },
                        { id: "CreatePost", label: "Marketplace Post", icon: ICONS.Post },
                        { id: "Scout", label: "AI Sourcing", icon: ICONS.Search },
                        { id: "History", label: "Archived Logs", icon: ICONS.History },
                    ].map(item => (
                        <button key={item.id} onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }} 
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-all group duration-300 ${view === item.id ? "bg-white text-slate-800 border border-slate-200 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"}`}>
                            <div className="flex items-center gap-3">
                                <div className={view === item.id ? "text-emerald-500" : ""}>{item.icon}</div>
                                <span className="tracking-tight">{item.label}</span>
                            </div>
                            {item.badge > 0 && <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-sm ${view === item.id ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{item.badge}</span>}
                        </button>
                    ))}

                    <div className="pt-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System</div>
                    <button onClick={() => { setView("Settings"); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all duration-300 ${view === "Settings" ? "bg-white text-slate-800 border border-slate-200 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"}`}>
                        <div className={view === "Settings" ? "text-emerald-500" : ""}>{ICONS.Settings}</div>
                        <span className="tracking-tight">System Config</span>
                    </button>
                </div>

                <div className="p-6 bg-white/40 border-t border-slate-200/60 mt-auto backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                            {formData.name ? formData.name.split(' ').map(n=>n[0]).join('').substring(0,2) : "GP"}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-black text-slate-800 truncate">{formData.name}</div>
                            <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase truncate">{formData.companyName}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full py-3 bg-white/50 hover:bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:text-rose-500 transition-all uppercase tracking-widest shadow-sm hover:shadow-md">
                        Terminate Session
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
            
            {/* --- Dynamic Aesthetic Background (Light Theme) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-amber-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-teal-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* --- Global Toast --- */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} 
                        className="fixed top-6 right-1/2 translate-x-1/2 px-6 py-4 bg-emerald-500 text-white rounded-2xl shadow-2xl shadow-emerald-500/20 z-[100] font-bold text-sm flex items-center gap-3 tracking-wide">
                        <span className="bg-white/20 rounded-lg p-1">{ICONS.Check}</span> {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {renderSidebar()}

            {/* --- MAIN DASHBOARD AREA --- */}
            <main className="flex-1 overflow-y-auto relative scrollbar-hide z-10 flex flex-col">
                
                {/* Topbar / Ticker */}
                <div className="min-h-[3rem] bg-white/50 backdrop-blur-xl border-b border-white/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-slate-800 bg-white/50 rounded-xl">
                        {ICONS.Menu}
                    </button>
                    <div className="hidden md:flex text-[10px] font-black text-emerald-600 uppercase px-4 whitespace-nowrap items-center gap-2 border-r border-slate-200 h-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Live Node
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 overflow-hidden w-full relative flex items-center h-full px-4 uppercase tracking-widest">
                        <div className="animate-marquee whitespace-nowrap flex gap-12 w-max absolute">
                            <span>Fund NAV: $34.8M (+12.4%)</span>
                            <span>AUM Growth Tracking at Target</span>
                            <span>New Deal Signals Detected in Logistics</span>
                            <span>FinTech allocations currently oversubscribed</span>
                            <span>Fund NAV: $34.8M (+12.4%)</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-12 pb-32 max-w-[1600px] w-full mx-auto space-y-10">
                    
                    {/* ------------------------------------------- */}
                    {/* VIEW 1: DASHBOARD OVERVIEW */}
                    {/* ------------------------------------------- */}
                    {view === "Dashboard" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{duration:0.4}} className="space-y-10">
                            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight uppercase italic">Fund Overview</h1>
                                    <p className="text-sm text-slate-500 mt-2 font-medium">Real-time portfolio metrics, deal flow volume, and asset allocation.</p>
                                </div>
                                <div className="text-left md:text-right bg-white/60 p-4 md:p-6 rounded-3xl border border-white shadow-sm backdrop-blur-md w-full md:w-auto">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets Under Management</div>
                                    <div className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter">$34,842,000</div>
                                </div>
                            </header>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { l: 'Pending Deals', v: requests.length, s: 'Inbound Signals', c: 'text-blue-500', bg: 'bg-blue-50' },
                                    { l: 'Active Mandates', v: myPosts.length, s: 'Marketplace Posts', c: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    { l: 'Yield Growth', v: '+34.2%', s: 'Annualized Return', c: 'text-amber-500', bg: 'bg-amber-50' },
                                    { l: 'Network Reach', v: '480+', s: 'Startup Nodes', c: 'text-violet-500', bg: 'bg-violet-50' }
                                ].map((k, i) => (
                                    <div key={i} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-6 md:p-8 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k.l}</div>
                                            <div className={`p-2 rounded-xl ${k.bg} ${k.c}`}>{ICONS.TrendingUp}</div>
                                        </div>
                                        <div className="text-3xl md:text-4xl font-black text-slate-800">{k.v}</div>
                                        <div className="text-[10px] text-slate-500 font-bold mt-2 uppercase">{k.s}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* NAV Area Chart */}
                                <div className="col-span-1 lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2.5rem] shadow-sm flex flex-col">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 uppercase italic">Fund NAV Trajectory</h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trailing 6 Quarters</p>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg">+12.4% Q2</span>
                                    </div>
                                    <div className="flex-1 min-h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={PERFORMANCE_DATA} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                                                <defs>
                                                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} dy={10} tick={{fontWeight: 'bold'}} />
                                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}M`} />
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fill="url(#colorNav)" activeDot={{r: 8, fill: "#10b981", stroke: "#fff", strokeWidth: 3}} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Allocation Pie Chart */}
                                <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-black text-slate-800 uppercase italic">Capital Allocation</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">By Sector</p>
                                    </div>
                                    <div className="h-48 w-full relative">
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={ALLOCATION_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                                    {ALLOCATION_DATA.map((e,i) => <Cell key={i} fill={e.color}/>)}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', fontWeight: 'bold'}} formatter={(val) => `${val}%`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        {/* Center Label */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl font-black text-slate-800">4</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sectors</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-8">
                                        {ALLOCATION_DATA.map(a => (
                                            <div key={a.name} className="flex justify-between items-center px-4 py-3 bg-white/80 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: a.color}}></div>
                                                    <span className="text-xs font-black text-slate-700">{a.name}</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-800">{a.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 2: CREATE POST (Mandates) */}
                    {/* ------------------------------------------- */}
                    {view === "CreatePost" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                            
                            {/* Left: Form */}
                            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-sm h-fit relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                
                                <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Issue Mandate</h2>
                                <p className="text-sm text-slate-500 mb-8 font-medium">Broadcast your investment criteria to our verified network of 480+ startups.</p>
                                
                                <form onSubmit={handleCreatePost} className="space-y-6 relative z-10">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Mandate Title</label>
                                        <input value={newPost.title} onChange={e=>setNewPost({...newPost, title: e.target.value})} placeholder="e.g. Seeking Supply Chain AI Pilots" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Sector</label>
                                            <input value={newPost.sector} onChange={e=>setNewPost({...newPost, sector: e.target.value})} placeholder="Logistics / AI" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Allocation / Check</label>
                                            <input value={newPost.budget} onChange={e=>setNewPost({...newPost, budget: e.target.value})} placeholder="$1M - $3M" className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Thesis / Description</label>
                                        <textarea value={newPost.description} onChange={e=>setNewPost({...newPost, description: e.target.value})} placeholder="Provide specific criteria, metrics required, or strategic value you bring..." className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 h-32 resize-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm leading-relaxed" required />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl uppercase text-sm tracking-widest transition-all shadow-xl shadow-slate-900/10 transform hover:-translate-y-1">
                                        Broadcast to Network
                                    </button>
                                </form>
                            </div>

                            {/* Right: Active Posts List */}
                            <div className="lg:col-span-3 space-y-6">
                                <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-6">Live Mandates</h3>
                                
                                {myPosts.length === 0 ? (
                                    <div className="p-20 text-center text-slate-500 font-bold border-2 border-slate-200 border-dashed rounded-[2.5rem] bg-white/30 backdrop-blur-sm">
                                        No active mandates broadcasting.
                                    </div>
                                ) : myPosts.map((post, idx) => (
                                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: idx*0.1}} key={post.id} 
                                        className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        
                                        <div className="flex-1 pr-0 md:pr-10 mb-6 md:mb-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="flex items-center gap-1.5 text-[9px] font-black bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Broadcasting
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.timestamp}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight italic mb-2">{post.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{post.desc || post.description}</p>
                                            
                                            <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <span className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">{ICONS.Briefcase} {post.sector}</span>
                                                <span className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">Cap: <span className="text-slate-800">{post.budget}</span></span>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-10 shrink-0">
                                            <div className="text-4xl font-black text-slate-800">{post.applicants}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pitch Responses</div>
                                            <button className="mt-6 w-full md:w-auto text-[11px] font-black bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm">Review Deals</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 3: INBOX (DEAL PIPELINE) */}
                    {/* ------------------------------------------- */}
                    {view === "Inbox" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] overflow-hidden min-h-[600px] shadow-sm relative flex flex-col">
                            
                            {/* Header */}
                            <div className="p-8 md:p-10 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40">
                                <div>
                                    <h3 className="font-black text-slate-800 text-3xl uppercase tracking-tighter italic">Deal Pipeline</h3>
                                    <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Inbound pitches & algorithm matches</p>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-full text-[10px] font-black border border-emerald-200 tracking-widest shadow-sm">
                                    {requests.length} ACTION REQUIRED
                                </div>
                            </div>

                            {/* List of Deals */}
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
                                {requests.length === 0 ? (
                                    <div className="p-20 text-center flex flex-col items-center">
                                        <div className="text-6xl text-slate-300 mb-4">📥</div>
                                        <div className="text-xl font-black text-slate-800">Inbox Zero</div>
                                        <p className="text-slate-500 font-medium mt-2">All inbound deals have been processed.</p>
                                    </div>
                                ) : requests.map(req => (
                                    <div key={req._id} onClick={() => setSelectedDeal(req)} className="p-8 hover:bg-white/80 cursor-pointer flex flex-col sm:flex-row items-start gap-6 sm:gap-8 group transition-all">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-700 rounded-[1.25rem] flex items-center justify-center text-white text-2xl font-black shrink-0 uppercase italic shadow-md group-hover:scale-105 transition-transform">
                                            {req.startupName[0]}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                                <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{req.startupName}</h4>
                                                <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg mt-2 sm:mt-0 whitespace-nowrap">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                {ICONS.User} {req.senderEmail}
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium line-clamp-2 pr-0 md:pr-12 leading-relaxed">
                                                {req.message}
                                            </p>
                                        </div>
                                        
                                        {/* Action Hint */}
                                        <div className="hidden md:flex shrink-0 h-full items-center pl-4 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ⭐ DETAILED MODAL FOR INBOX (Term Sheet View) */}
                    <AnimatePresence>
                        {selectedDeal && (
                            <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/40 backdrop-blur-sm">
                                <motion.div 
                                    initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                                    className="bg-[#FAFAFA] w-full max-w-4xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                                >
                                    {/* Modal Header */}
                                    <div className="bg-slate-800 text-white p-8 md:p-10 relative shrink-0">
                                        <button onClick={() => setSelectedDeal(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-md transition-colors">
                                            {ICONS.X}
                                        </button>
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-slate-800 text-4xl font-black italic shadow-lg">
                                                {selectedDeal.startupName[0]}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Pitch
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">{selectedDeal.startupName}</h2>
                                                <div className="text-sm font-medium text-slate-400 mt-1">{selectedDeal.senderEmail}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-white/50 backdrop-blur-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                            {/* Metrics Panel */}
                                            <div className="md:col-span-1 space-y-4">
                                                <div className="bg-white border border-slate-200 p-6 rounded-[1.5rem] shadow-sm">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Key Metrics</h4>
                                                    <div className="space-y-4">
                                                        <div><div className="text-[9px] text-slate-400 uppercase font-bold">ARR</div><div className="text-xl font-black text-slate-800">{selectedDeal.metrics.arr}</div></div>
                                                        <div><div className="text-[9px] text-slate-400 uppercase font-bold">Growth</div><div className="text-xl font-black text-emerald-600">{selectedDeal.metrics.growth}</div></div>
                                                        <div><div className="text-[9px] text-slate-400 uppercase font-bold">Runway</div><div className="text-xl font-black text-slate-800">{selectedDeal.metrics.runway}</div></div>
                                                        <div className="pt-4 border-t border-slate-100"><div className="text-[9px] text-slate-400 uppercase font-bold">Target Valuation</div><div className="text-2xl font-black text-slate-800">{selectedDeal.metrics.capValuation}</div></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Message Panel */}
                                            <div className="md:col-span-2">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    {ICONS.FileText} Founder's Memo
                                                </h4>
                                                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm text-slate-700 leading-relaxed font-medium text-[15px] relative">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-l-[2rem]"></div>
                                                    "{selectedDeal.message}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer (Actions) */}
                                    <div className="p-6 md:p-8 border-t border-slate-200 bg-white flex flex-col sm:flex-row gap-4 shrink-0">
                                        <button onClick={() => handleAction(selectedDeal._id, 'Accepted')} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                            {ICONS.Check} Accept & Request DD
                                        </button>
                                        <button onClick={() => handleAction(selectedDeal._id, 'Rejected')} className="flex-1 py-4 bg-white border-2 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            {ICONS.X} Archive Deal
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* ------------------------------------------- */}
                    {/* VIEW 4: AI SCOUT (Discover Deals) */}
                    {/* ------------------------------------------- */}
                    {view === "Scout" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <header>
                                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight italic">AI Sourcing Engine</h2>
                                <p className="text-sm text-slate-500 font-medium mt-2">Algorithmic matches based on your "MERN/AI" thesis.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {suggestions.map((s, i) => (
                                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: i*0.05}} key={s.id} 
                                        className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                        
                                        {s.connected && (
                                            <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white">
                                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4">{ICONS.Check}</div>
                                                <div className="font-black text-sm tracking-widest uppercase italic">Mandate Dispatched</div>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-black text-3xl italic shadow-md">{s.name[0]}</div>
                                            
                                            {/* Circular Match Dial */}
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-12 h-12 flex items-center justify-center">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                        <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                        <path className="text-emerald-500" strokeDasharray={`${s.match}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    </svg>
                                                    <span className="absolute text-[10px] font-black text-slate-800">{s.match}%</span>
                                                </div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Match</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic group-hover:text-emerald-600 transition-colors">{s.name}</h3>
                                        <div className="flex gap-2 mt-2 mb-4">
                                            <span className="text-[9px] font-black text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">{s.industry}</span>
                                            <span className="text-[9px] font-black text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">{s.stage}</span>
                                        </div>
                                        
                                        <p className="text-sm text-slate-600 font-medium line-clamp-3 mb-8 flex-1">{s.desc}</p>
                                        
                                        <div className="flex justify-between items-end border-t border-slate-200 pt-6 mt-auto">
                                            <div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Founding Ask</div>
                                                <div className="text-slate-800 font-black text-2xl tracking-tighter italic">{s.ask}</div>
                                            </div>
                                            <button onClick={() => handleConnect(s)} className="bg-slate-800 text-white font-black text-[10px] px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-md transform hover:-translate-y-0.5">
                                                Engage
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW 5: HISTORY (Archived Logs) */}
                    {/* ------------------------------------------- */}
                    {view === "History" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-200">
                                <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Investment Ledger</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="bg-white/40 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 tracking-widest">
                                        <tr>
                                            <th className="px-8 py-6">Entity</th>
                                            <th className="px-8 py-6">Processed Date</th>
                                            <th className="px-8 py-6 text-center">Status</th>
                                            <th className="px-8 py-6">Reason / Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {history.map((h, i) => (
                                            <tr key={i} className="hover:bg-white/80 transition-colors group">
                                                <td className="px-8 py-6 font-black text-slate-800 uppercase italic tracking-tighter text-lg">{h.name}</td>
                                                <td className="px-8 py-6 font-bold text-slate-500">{h.date}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${h.status === 'Accepted' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                                                        {h.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 font-medium text-slate-600 truncate max-w-[250px]">{h.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* ⭐ VIEW 6: SYSTEM SETTINGS (Advanced Config) */}
                    {/* ------------------------------------------- */}
                    {view === "Settings" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10">
                            <header className="border-b border-slate-200/60 pb-8">
                                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight italic">System Configuration</h2>
                                <p className="text-sm text-slate-500 mt-2 font-medium">Manage firm identity, algorithm calibration, and alert routing.</p>
                            </header>

                            {/* Tab Navigation */}
                            <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-hide">
                                {["General", "Fund Logic", "Notifications"].map(tab => (
                                    <button key={tab} onClick={() => setSettingsTab(tab)} 
                                        className={`px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${settingsTab === tab ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-white/50"}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSaveSettings} className="bg-white/60 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                                
                                {settingsTab === "General" && (
                                    <div className="space-y-8 animate-fadeIn">
                                        <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">{ICONS.Briefcase}</div> Firm Identity
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Firm Entity Name</label>
                                                <input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Operating Partner (User)</label>
                                                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {settingsTab === "Fund Logic" && (
                                    <div className="space-y-8 animate-fadeIn">
                                        <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">{ICONS.Search}</div> Sourcing Calibration
                                        </h3>
                                        <div className="grid grid-cols-1 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Core Investment Thesis (AI Prompts)</label>
                                                <textarea value={formData.thesis} onChange={e => setFormData({...formData, thesis: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm h-24 resize-none leading-relaxed" />
                                                <p className="text-[10px] font-bold text-slate-400 mt-2">The AI Sourcing Engine uses this to calculate Match %.</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Check Size</label>
                                                <select value={formData.checkSize} onChange={e => setFormData({...formData, checkSize: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 outline-none transition-all shadow-sm cursor-pointer appearance-none">
                                                    <option>$100k - $500k (Pre-Seed)</option>
                                                    <option>$500k - $2M (Seed)</option>
                                                    <option>$2M - $10M (Series A/B)</option>
                                                    <option>$10M+ (Growth)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {settingsTab === "Notifications" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div> Node Routing
                                        </h3>
                                        
                                        <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                            <div>
                                                <h4 className="font-black text-slate-800 text-sm">Email Gateway Alerts</h4>
                                                <p className="text-xs text-slate-500 font-medium mt-1">Receive daily digests of new inbound pitches.</p>
                                            </div>
                                            <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${formData.emailNotifications ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}>
                                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${formData.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm opacity-60">
                                            <div>
                                                <h4 className="font-black text-slate-800 text-sm">Auto-Decline (<span className="text-rose-500">&lt;60% Match</span>)</h4>
                                                <p className="text-xs text-slate-500 font-medium mt-1">Automatically archive pitches that do not meet thesis criteria.</p>
                                            </div>
                                            <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors bg-slate-200`}>
                                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform translate-x-0`}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10 pt-8 border-t border-slate-200 flex justify-end">
                                    <button type="submit" className="w-full md:w-auto px-12 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl uppercase text-xs tracking-widest transition-all shadow-xl shadow-slate-900/10 transform hover:-translate-y-1 flex justify-center items-center gap-2">
                                        Update System Protocol
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}