import React, { useState, useEffect, useMemo } from "react";
// Agar tumhare paas AuthContext nahi hai, toh isko mock kar lena. Abhi ke liye destructuring safe rakhi hai.
import { useAuth } from "../Context/AuthContext"; 
import { 
    AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, CartesianGrid, 
    PieChart, Pie, Cell, BarChart, Bar, YAxis, Legend 
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. MASSIVE ICON LIBRARY (Aesthetic Outlines)
// ==========================================
const ICONS = {
    Menu: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Download: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Close: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
    Settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    User: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Chart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Key: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
    Code: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Database: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
    CreditCard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    ExternalLink: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
};

// ==========================================
// 2. MASSIVE MOCK DATA (Company Level)
// ==========================================
const MOCK_STARTUPS = [
    { 
        id: 1, name: "NearBites", industry: "FoodTech & Delivery", stage: "Series A", 
        ask: "$4.5M", equity: "15%", valuation: "$30M",
        logo: "NB", color: "from-orange-400 to-rose-500",
        desc: "Full-stack hyper-local food ordering application featuring dual-role authentication, a highly optimized cart system, and real-time vendor management. Built entirely on the MERN stack with advanced state management.",
        longDesc: "NearBites is revolutionizing the hyper-local delivery market. By empowering local street vendors and medium-scale restaurants with an enterprise-grade MERN stack platform, it eliminates exorbitant aggregator commissions. The platform features robust real-time tracking, an intelligent recommendation engine using MongoDB aggregation pipelines, and secure payment gateways. The founding team brings extreme technical depth and competitive programming backgrounds to optimize delivery routing algorithms.",
        revenue: [10, 35, 75, 120, 210, 340, 500, 750], 
        burnRate: [15, 20, 25, 40, 60, 85, 100, 110],
        capTable: [{ name: "Founders", value: 65 }, { name: "Seed Investors", value: 20 }, { name: "ESOPs", value: 15 }],
        team: "Ex-Zomato & Expert CP Coders", runway: "24 Months",
        metrics: { users: "125K+", growth: "34% MoM", cac: "$4.20", ltv: "$45.00" },
        tags: ["MERN", "B2B2C", "Logistics", "Hyper-local"]
    },
    { 
        id: 2, name: "EduCore", industry: "EdTech & LMS", stage: "Seed", 
        ask: "$1.2M", equity: "10%", valuation: "$12M",
        logo: "EC", color: "from-emerald-400 to-teal-500",
        desc: "Next-generation local server educational core platform utilizing complex SQL databases and React frontends to manage institutional resources and assignments seamlessly.",
        longDesc: "EduCore provides a self-hosted, extremely resilient Learning Management System designed for institutions in low-bandwidth areas. By leveraging localized SQL servers with intelligent cloud-syncing capabilities, it ensures zero downtime during critical examinations and lectures. It includes automated grading algorithms, plagiarism detection, and a highly customizable, aesthetic frontend for students to manage portfolios and presentations.",
        revenue: [5, 12, 28, 45, 65, 90, 140, 200],
        burnRate: [10, 15, 20, 25, 30, 35, 40, 45],
        capTable: [{ name: "Founders", value: 80 }, { name: "Angel Syndicate", value: 10 }, { name: "ESOPs", value: 10 }],
        team: "University Professors & Tech Leads", runway: "18 Months",
        metrics: { users: "45 Institutions", growth: "12% MoM", cac: "$120", ltv: "$4,500" },
        tags: ["SaaS", "SQL", "React", "Education"]
    },
    { 
        id: 3, name: "Nebula AI", industry: "Artificial Intelligence", stage: "Series B", 
        ask: "$25M", equity: "12%", valuation: "$208M",
        logo: "NA", color: "from-violet-500 to-fuchsia-500",
        desc: "Generative AI specifically fine-tuned for enterprise supply chain optimization. Reduces global logistics costs by up to 30% using predictive modeling.",
        longDesc: "Nebula AI is not just another LLM wrapper. They have built proprietary foundational models trained on decades of global shipping, weather, and geopolitical data. Their predictive engine allows Fortune 500 supply chain managers to foresee bottlenecks weeks in advance. The API easily integrates with legacy SAP and Oracle databases, providing modern, aesthetic dashboards to legacy industries.",
        revenue: [100, 250, 450, 800, 1200, 2100, 3500, 5000],
        burnRate: [200, 350, 500, 650, 800, 1000, 1200, 1500],
        capTable: [{ name: "Founders", value: 45 }, { name: "Series A", value: 25 }, { name: "Seed", value: 15 }, { name: "ESOPs", value: 15 }],
        team: "Ex-DeepMind & Logistics Veterans", runway: "36 Months",
        metrics: { users: "12 Enterprise", growth: "110% YoY", cac: "$55,000", ltv: "$1.2M+" },
        tags: ["LLM", "Enterprise", "Logistics", "Deep Tech"]
    },
    { 
        id: 4, name: "GreenVolt", industry: "CleanTech", stage: "Series A", 
        ask: "$8.5M", equity: "15%", valuation: "$56M",
        logo: "GV", color: "from-green-400 to-emerald-600",
        desc: "Next-gen solid-state batteries for EV manufacturers. Offering 2x range and 50% faster charging times compared to standard lithium-ion.",
        longDesc: "GreenVolt has patented a novel silicon-anode composition that stabilizes solid-state battery structures at room temperature. This breakthrough eliminates the risk of thermal runaway (fires) while doubling energy density. They have already secured pilot programs with two major European automotive manufacturers and are raising Series A to build their first pilot manufacturing facility.",
        revenue: [0, 0, 5, 15, 40, 100, 250, 600],
        burnRate: [50, 80, 120, 200, 350, 500, 800, 1200],
        capTable: [{ name: "Founders", value: 55 }, { name: "Seed", value: 30 }, { name: "ESOPs", value: 15 }],
        team: "Stanford Physics PhDs", runway: "14 Months",
        metrics: { users: "2 Pilots", growth: "N/A", cac: "N/A", ltv: "N/A" },
        tags: ["Hardware", "EV", "Sustainability", "Patented"]
    },
    { 
        id: 5, name: "FinMesh", industry: "Fintech", stage: "Pre-Seed", 
        ask: "$850k", equity: "8%", valuation: "$10.6M",
        logo: "FM", color: "from-sky-400 to-indigo-500",
        desc: "Decentralized payment rails for cross-border B2B transactions. Instant settlement with zero correspondent banking fees.",
        longDesc: "Cross-border B2B payments are slow, expensive, and opaque. FinMesh leverages a layer-2 blockchain solution customized for institutional compliance (KYC/AML built into the smart contracts). By bypassing SWIFT, they reduce settlement times from 3 days to 3 seconds, taking a flat 0.1% fee instead of the industry standard 2-3%.",
        revenue: [1, 3, 8, 15, 25, 40, 65, 100],
        burnRate: [10, 15, 20, 25, 30, 40, 50, 60],
        capTable: [{ name: "Founders", value: 85 }, { name: "Friends & Family", value: 5 }, { name: "ESOPs", value: 10 }],
        team: "Y Combinator W24 Alumni", runway: "12 Months",
        metrics: { users: "450 SMBs", growth: "45% MoM", cac: "$85", ltv: "$1,200" },
        tags: ["Web3", "B2B", "Payments", "Defi"]
    },
    { 
        id: 6, name: "MediCore", industry: "HealthTech", stage: "Series C", 
        ask: "$45M", equity: "N/A", valuation: "$450M",
        logo: "MC", color: "from-rose-500 to-red-600",
        desc: "AI-driven robotic surgery assistant. FDA approved for cardiac procedures, assisting surgeons with micro-millimeter precision.",
        longDesc: "MediCore is the future of operating rooms. Their robotic suite doesn't replace the surgeon; it gives them superpowers. By stabilizing micro-tremors and overlaying AR imagery of the patient's internal organs directly onto the surgical console, MediCore reduces cardiac surgery complication rates by 18%. They are raising Series C for global expansion into European and Asian markets.",
        revenue: [500, 1200, 2500, 4500, 8000, 14000, 22000, 35000],
        burnRate: [1000, 1500, 2200, 3000, 4500, 6000, 8500, 11000],
        capTable: [{ name: "Founders", value: 30 }, { name: "VCs", value: 60 }, { name: "ESOPs", value: 10 }],
        team: "Ex-Johnson & Johnson, Medtronic", runway: "48 Months",
        metrics: { users: "85 Hospitals", growth: "40% YoY", cac: "$120,000", ltv: "$4.5M+" },
        tags: ["Robotics", "FDA", "MedTech", "Hardware"]
    },
    {
        id: 7, name: "AeroDyne", industry: "SpaceTech", stage: "Seed",
        ask: "$3.5M", equity: "18%", valuation: "$19.4M",
        logo: "AD", color: "from-slate-700 to-black",
        desc: "Low Earth Orbit (LEO) debris clearing autonomous drones. Protecting critical satellite infrastructure from high-speed collisions.",
        longDesc: "Space junk is a multi-billion dollar threat to global communications. AeroDyne has developed autonomous, solar-powered 'janitor' satellites that capture and de-orbit micro-debris. With a proprietary magnetic tethering system, a single AeroDyne unit can clear up to 50 pieces of debris before burning up in the atmosphere. They have secured a preliminary contract with the ESA.",
        revenue: [0, 0, 0, 0, 50, 150, 300, 500],
        burnRate: [80, 150, 250, 400, 500, 600, 750, 900],
        capTable: [{ name: "Founders", value: 70 }, { name: "Seed", value: 15 }, { name: "ESOPs", value: 15 }],
        team: "Ex-SpaceX & NASA JPL", runway: "20 Months",
        metrics: { users: "1 Gov Agency", growth: "N/A", cac: "N/A", ltv: "$5M" },
        tags: ["Aerospace", "Government", "Hardware", "Deep Tech"]
    },
    {
        id: 8, name: "QuantumSec", industry: "Cybersecurity", stage: "Series A",
        ask: "$12M", equity: "10%", valuation: "$120M",
        logo: "QS", color: "from-purple-600 to-indigo-800",
        desc: "Post-quantum cryptographic key management system. Future-proofing enterprise data against quantum computing decryption attacks.",
        longDesc: "Standard RSA encryption will be rendered obsolete by quantum computers within the decade. QuantumSec provides a drop-in software solution for banks and military contractors to upgrade their data storage to NIST-approved post-quantum algorithms. Their unique selling point is the zero-downtime integration architecture that works with legacy mainframes.",
        revenue: [20, 60, 150, 350, 700, 1200, 2000, 3200],
        burnRate: [100, 200, 350, 500, 750, 1000, 1300, 1600],
        capTable: [{ name: "Founders", value: 60 }, { name: "Series A", value: 20 }, { name: "Seed", value: 10 }, { name: "ESOPs", value: 10 }],
        team: "MIT Cryptography Researchers", runway: "30 Months",
        metrics: { users: "28 Enterprise", growth: "85% YoY", cac: "$25,000", ltv: "$450,000" },
        tags: ["Security", "B2B", "Quantum", "SaaS"]
    }
];

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================
const formatCurrency = (value) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value}`;
};

const generateDates = (count) => {
    const dates = [];
    let d = new Date();
    for (let i = 0; i < count; i++) {
        dates.unshift(`${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().substr(-2)}`);
        d.setMonth(d.getMonth() - 1);
    }
    return dates;
};

// ==========================================
// 4. MAIN DASHBOARD COMPONENT
// ==========================================
export default function CorporateDashboard() {
    // Auth context (Mocking user if not available)
    const auth = useAuth() || {};
    const defaultUser = { name: "Krish Taliyan", email: "krish.taliyan@investor.co", companyName: "Taliyan Capital", title: "Managing Partner" };
    const user = auth.user || defaultUser;
    const logout = auth.logout || (() => console.log("Logged out"));
    const updateUser = auth.updateUser || ((data) => console.log("Updated", data));
    
    // Core State
    const [view, setView] = useState("Scout"); 
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [toast, setToast] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState("General");
    
    // Form State for Profile
    const [formData, setFormData] = useState({ 
        name: user?.name || "", 
        companyName: user?.companyName || "", 
        title: user?.title || "", 
        email: user?.email || "",
        bio: "Focused on high-growth MERN stack and deep-tech startups. Looking for founders with extreme technical depth and competitive programming backgrounds."
    });

    // Handle Window Resize to auto-close mobile menu
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter Logic
    const filteredStartups = useMemo(() => {
        return MOCK_STARTUPS.filter(s => {
            const matchesCategory = filter === "All" || s.industry.includes(filter) || (filter === 'High Value' && s.ask.includes('M'));
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [filter, searchQuery]);

    // Toast Utility
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Actions
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateUser(formData);
        showToast("Profile Updated Successfully", "success");
    };

    const handleSaveSettings = () => showToast("Security & System Preferences Saved", "success");
    const handleDownload = () => showToast("Downloading Pitch Deck & Financial Models...", "info");
    const handleMeeting = () => showToast("Meeting Request sent to Founder's Calendar", "success");

    // ==========================================
    // RENDER: SIDEBAR (Desktop & Mobile)
    // ==========================================
    const renderSidebar = () => (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-white/60 backdrop-blur-2xl border-r border-white/40 flex flex-col z-50 shadow-2xl md:shadow-none`}>
                
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-white/30 bg-white/40">
                    <div className="text-2xl font-black text-slate-800 tracking-tighter">
                        NEXUS<span className="text-emerald-500">VC</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800">
                        {ICONS.Close}
                    </button>
                </div>
                
                {/* Navigation Links */}
                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-4 mb-3">Discovery</div>
                    <button onClick={() => { setView("Scout"); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Scout" ? "bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60" : "text-slate-500 hover:text-slate-700 hover:bg-white/40"}`}>
                        <div className={`${view === "Scout" ? "text-emerald-500" : ""}`}>{ICONS.Search}</div> Deal Flow
                    </button>
                    <button onClick={() => { setView("Portfolio"); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Portfolio" ? "bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60" : "text-slate-500 hover:text-slate-700 hover:bg-white/40"}`}>
                        <div className={`${view === "Portfolio" ? "text-rose-500" : ""}`}>{ICONS.Briefcase}</div> My Portfolio
                    </button>
                    
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-4 mb-3 mt-8">Management</div>
                    <button onClick={() => { setView("Profile"); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Profile" ? "bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60" : "text-slate-500 hover:text-slate-700 hover:bg-white/40"}`}>
                        <div className={`${view === "Profile" ? "text-violet-500" : ""}`}>{ICONS.User}</div> Identity
                    </button>
                    <button onClick={() => { setView("Settings"); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${view === "Settings" ? "bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60" : "text-slate-500 hover:text-slate-700 hover:bg-white/40"}`}>
                        <div className={`${view === "Settings" ? "text-amber-500" : ""}`}>{ICONS.Settings}</div> Preferences
                    </button>
                </div>

                {/* User Card */}
                <div className="p-6 border-t border-white/30 mt-auto bg-white/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/30">
                            {user.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-extrabold text-slate-800 truncate">{user.name}</div>
                            <div className="text-[10px] font-bold text-slate-500 truncate tracking-wide">{user.companyName}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full py-3 bg-white/50 hover:bg-white border border-white/60 rounded-xl text-xs font-extrabold text-slate-600 hover:text-rose-500 transition-all shadow-sm">
                        SECURE LOGOUT
                    </button>
                </div>
            </aside>
        </>
    );

    // ==========================================
    // MAIN RENDER
    // ==========================================
    return (
        // Dynamic Aesthetic Background (No dark mode, no deep blues)
        <div className="flex h-screen bg-[#FAFAFA] font-sans overflow-hidden selection:bg-emerald-200 selection:text-emerald-900 relative">
            
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-amber-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-teal-200/40 blur-[120px] rounded-full mix-blend-multiply animate-blob animation-delay-4000"></div>
            </div>

            {/* Global Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl z-[100] font-bold flex items-center gap-3 backdrop-blur-xl border ${
                            toast.type === "success" ? "bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/20" : 
                            "bg-slate-800/90 border-slate-700 text-white shadow-slate-900/20"
                        }`}
                    >
                        <span className="text-2xl">{toast.type === "success" ? "✨" : "ℹ️"}</span> {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {renderSidebar()}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto relative z-10 flex flex-col scroll-smooth">
                
                {/* Responsive Top Bar / Ticker */}
                <div className="min-h-[3rem] bg-white/60 border-b border-white/40 flex items-center justify-between px-4 md:px-0 sticky top-0 z-30 backdrop-blur-xl shadow-sm">
                    {/* Mobile Hamburger */}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 bg-white/50 rounded-lg mr-4">
                        {ICONS.Menu}
                    </button>

                    <div className="hidden md:flex text-[10px] font-extrabold text-emerald-600 uppercase px-6 whitespace-nowrap items-center gap-2 border-r border-white/40 h-full bg-white/30">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Market Live
                    </div>
                    
                    <div className="text-[11px] font-bold text-slate-500 overflow-hidden w-full relative flex items-center h-full">
                        <div className="animate-marquee whitespace-nowrap flex gap-16 w-max absolute px-4">
                            <span>🚀 EduCore closes Seed round early</span>
                            <span>⚡ NearBites scales hyper-local algorithm</span>
                            <span>💰 AI Sector valuations normalizing at 15x ARR</span>
                            <span>📉 Hardware margins improving globally</span>
                            <span>🤝 YC W24 Demo Day metrics released</span>
                            <span>🚀 EduCore closes Seed round early</span>
                        </div>
                    </div>
                </div>

                {/* Page Content Wrappers */}
                <div className="p-6 md:p-12 pb-32 max-w-[1600px] w-full mx-auto">
                    
                    {/* ------------------------------------------- */}
                    {/* VIEW: SCOUT / DISCOVERY */}
                    {/* ------------------------------------------- */}
                    {view === "Scout" && (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.4}}>
                            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-3">
                                        Deal Flow <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Engine</span>
                                    </h1>
                                    <p className="text-slate-500 max-w-2xl text-sm md:text-base font-medium">
                                        Discover high-growth opportunities. Our proprietary algorithm curates the top 1% of startups based on your technical MERN & DeepTech preferences.
                                    </p>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                        {ICONS.Search}
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search by name, tech stack, or tags..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/70 border border-white/60 rounded-2xl text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm backdrop-blur-md transition-all"
                                    />
                                </div>
                            </header>

                            {/* FILTERS */}
                            <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                                {["All", "Artificial Intelligence", "FoodTech & Delivery", "EdTech & LMS", "CleanTech", "Fintech", "Cybersecurity"].map(t => (
                                    <button 
                                        key={t} 
                                        onClick={() => setFilter(t)} 
                                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border backdrop-blur-md ${
                                            filter === t 
                                            ? "bg-slate-800 text-white border-slate-700 shadow-xl shadow-slate-900/10 scale-105" 
                                            : "bg-white/50 text-slate-600 border-white/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* STARTUP GRID */}
                            {filteredStartups.length === 0 ? (
                                <div className="py-20 text-center bg-white/40 rounded-3xl border border-white/60 backdrop-blur-sm">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold text-slate-800">No startups found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    {filteredStartups.map((s, i) => (
                                        <motion.div 
                                            initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.05}}
                                            key={s.id} 
                                            onClick={() => setSelectedStartup(s)} 
                                            className="bg-white/60 border border-white/60 rounded-[2rem] p-6 hover:bg-white transition-all cursor-pointer group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] flex flex-col h-full relative overflow-hidden backdrop-blur-xl"
                                        >
                                            {/* Top Info */}
                                            <div className="flex justify-between items-start mb-6 relative z-10">
                                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-black text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                                    {s.logo}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-extrabold text-slate-600 uppercase tracking-widest shadow-sm">
                                                        {s.stage}
                                                    </span>
                                                    {s.ask.includes('M') && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-bold">High Value</span>}
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">{s.name}</h3>
                                            <div className="text-xs text-slate-500 font-extrabold uppercase mb-4 tracking-wider flex items-center gap-2">
                                                {s.industry}
                                            </div>
                                            
                                            <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3 flex-grow font-medium">
                                                {s.desc}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {s.tags.slice(0,3).map(tag => (
                                                    <span key={tag} className="px-2.5 py-1 bg-slate-100/80 text-slate-600 rounded-lg text-[10px] font-bold">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Financials Footer */}
                                            <div className="border-t border-slate-200/60 pt-5 grid grid-cols-2 gap-4 mt-auto">
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Target Ask</div>
                                                    <div className="text-slate-800 font-black text-xl">{s.ask}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Valuation</div>
                                                    <div className="text-emerald-600 font-black text-xl">{s.valuation}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW: PORTFOLIO (Dummy empty state for realism) */}
                    {/* ------------------------------------------- */}
                    {view === "Portfolio" && (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-5xl">
                            <header className="mb-10">
                                <h1 className="text-4xl font-black text-slate-800 mb-2">My Portfolio</h1>
                                <p className="text-slate-500">Track and manage your active investments.</p>
                            </header>
                            <div className="bg-white/50 border border-white/60 rounded-[2rem] p-12 text-center backdrop-blur-xl shadow-sm">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">💼</div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Active Investments</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8">You haven't committed to any startups yet. Head over to the Scout tab to find your next unicorn.</p>
                                <button onClick={() => setView("Scout")} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all shadow-xl shadow-slate-900/10">
                                    Explore Deal Flow
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW: PROFILE */}
                    {/* ------------------------------------------- */}
                    {view === "Profile" && (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto">
                            <header className="mb-10 text-center md:text-left">
                                <h1 className="text-4xl font-black text-slate-800 mb-2">Investor Identity</h1>
                                <p className="text-slate-500">Customize how founders see your profile and thesis.</p>
                            </header>

                            <div className="bg-white/60 border border-white/60 rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 backdrop-blur-2xl relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>
                                
                                <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
                                    
                                    {/* Avatar Upload area (visual only) */}
                                    <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-200/60">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-white">
                                            {formData.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                <button type="button" className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">Upload Photo</button>
                                                <button type="button" className="px-5 py-2 bg-transparent text-slate-500 rounded-xl text-sm font-bold hover:text-rose-500">Remove</button>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-3 font-medium">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                            <input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                            <input value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} type="email" className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Venture Firm / Entity</label>
                                            <input value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Role / Title</label>
                                            <input value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Investment Thesis & Bio</label>
                                        <textarea value={formData.bio} onChange={e=>setFormData({...formData, bio:e.target.value})} className="w-full h-40 bg-white/80 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none shadow-sm leading-relaxed" placeholder="Describe your investment focus..."></textarea>
                                    </div>

                                    <div className="pt-6 border-t border-slate-200/60 flex justify-end">
                                        <button className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 hover:-translate-y-1 transition-all">
                                            Save Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* ------------------------------------------- */}
                    {/* VIEW: SETTINGS */}
                    {/* ------------------------------------------- */}
                    {view === "Settings" && (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto">
                            <header className="mb-8">
                                <h1 className="text-4xl font-black text-slate-800 mb-2">Preferences</h1>
                                <p className="text-slate-500">Configure your system behavior, security, and alerts.</p>
                            </header>

                            {/* Settings Tabs */}
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200/60">
                                {["General", "Security", "Notifications", "API Access"].map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveSettingsTab(tab)}
                                        className={`px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                                            activeSettingsTab === tab ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white/60 border border-white/60 rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 backdrop-blur-2xl">
                                
                                {activeSettingsTab === "General" && (
                                    <div className="space-y-8 animate-fadeIn">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white/50 rounded-2xl border border-white">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">Default Currency</h3>
                                                <p className="text-sm text-slate-500 mt-1">Set the display currency for all startup metrics.</p>
                                            </div>
                                            <select className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-auto">
                                                <option>USD ($)</option>
                                                <option>EUR (€)</option>
                                                <option>GBP (£)</option>
                                                <option>INR (₹)</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white/50 rounded-2xl border border-white">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">Deal Flow Minimum Valuation</h3>
                                                <p className="text-sm text-slate-500 mt-1">Hide startups below this pre-money valuation.</p>
                                            </div>
                                            <input type="number" defaultValue={1000000} className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-auto text-right" />
                                        </div>
                                    </div>
                                )}

                                {activeSettingsTab === "Security" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/50 rounded-2xl border border-white">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">{ICONS.Shield}</div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800">Two-Factor Authentication</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Secure your account with an authenticator app.</p>
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl w-full sm:w-auto">Enable 2FA</button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/50 rounded-2xl border border-white">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-slate-100 text-slate-500 rounded-xl">{ICONS.Key}</div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800">Password</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Last changed 45 days ago.</p>
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl w-full sm:w-auto">Update</button>
                                        </div>
                                    </div>
                                )}

                                {activeSettingsTab === "Notifications" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        {[
                                            { title: "New Match Alerts", desc: "Email when a startup matches your MERN/Tech thesis.", default: true },
                                            { title: "Weekly Digest", desc: "A summary of platform activity and funded deals.", default: false },
                                            { title: "Message Alerts", desc: "When founders reply to your meeting requests.", default: true }
                                        ].map((notif, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-white">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800">{notif.title}</h3>
                                                    <p className="text-sm text-slate-500 mt-1">{notif.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked={notif.default} />
                                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSettingsTab === "API Access" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="p-6 bg-slate-800 rounded-2xl text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-10 opacity-10">{ICONS.Code}</div>
                                            <h3 className="text-xl font-bold mb-2 relative z-10">Developer API</h3>
                                            <p className="text-slate-400 text-sm mb-6 max-w-md relative z-10">Access your portfolio data headlessly. Generate API keys to use in your custom integrations.</p>
                                            
                                            <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center relative z-10">
                                                <div className="font-mono text-emerald-400 text-sm blur-[4px] hover:blur-none transition-all cursor-pointer">
                                                    sk_live_9a8b7c6d5e4f3a2b1c0d...
                                                </div>
                                                <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg">Copy</button>
                                            </div>
                                            <div className="mt-4 flex gap-3">
                                                <button className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400 transition-colors">Generate New Key</button>
                                                <button className="px-5 py-2.5 bg-slate-700 text-white text-sm font-bold rounded-xl hover:bg-slate-600 transition-colors">Documentation</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10 pt-6 border-t border-slate-200/60 flex justify-end">
                                    <button onClick={handleSaveSettings} className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/15 hover:-translate-y-1 transition-all">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>

                {/* ------------------------------------------- */}
                {/* ⭐ DETAILED DOSSIER MODAL (Popup) */}
                {/* ------------------------------------------- */}
                <AnimatePresence>
                    {selectedStartup && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-end md:items-center justify-center sm:p-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                className="bg-[#FAFAFA] w-full max-w-6xl rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl relative flex flex-col h-[90vh] md:h-[85vh] overflow-hidden"
                            >
                                {/* Modal Header (Banner) */}
                                <div className={`h-32 md:h-48 bg-gradient-to-r ${selectedStartup.color} relative shrink-0`}>
                                    <button onClick={() => setSelectedStartup(null)} className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/20 hover:bg-black/40 p-2.5 rounded-full text-white transition-colors backdrop-blur-md z-10">
                                        {ICONS.Close}
                                    </button>
                                    
                                    {/* Logo overlaps header and content */}
                                    <div className="absolute -bottom-12 left-6 md:left-12 w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] p-2 shadow-xl shadow-black/10">
                                        <div className={`w-full h-full rounded-[1.5rem] bg-gradient-to-br ${selectedStartup.color} flex items-center justify-center text-4xl md:text-5xl font-black text-white`}>
                                            {selectedStartup.logo}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Scrollable Body */}
                                <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-12 pt-16 md:pt-20">
                                    
                                    {/* Title & Actions Row */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-200 pb-8">
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">{selectedStartup.name}</h2>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200">
                                                    {selectedStartup.industry}
                                                </span>
                                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-xs font-black uppercase tracking-widest">
                                                    {selectedStartup.stage} Round
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap w-full md:w-auto gap-3">
                                            <button onClick={handleDownload} className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex">
                                                {ICONS.Download} Data Room
                                            </button>
                                            <button onClick={handleMeeting} className="flex-1 md:flex-none justify-center px-8 py-4 bg-slate-800 text-white rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all shadow-xl shadow-slate-900/15">
                                                Schedule Meeting
                                            </button>
                                        </div>
                                    </div>

                                    {/* Two-Column Content Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                                        
                                        {/* Left Col: Details & Charts (Takes 2 columns on lg) */}
                                        <div className="col-span-1 lg:col-span-2 space-y-10">
                                            
                                            {/* Summary */}
                                            <section>
                                                <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                                    {ICONS.Database} Executive Summary
                                                </h4>
                                                <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                    {selectedStartup.longDesc}
                                                </p>
                                            </section>

                                            {/* Financial Metrics Row */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {Object.entries(selectedStartup.metrics).map(([key, val]) => (
                                                    <div key={key} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{key}</div>
                                                        <div className="text-xl md:text-2xl font-black text-slate-800">{val}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Complex Chart: Revenue vs Burn */}
                                            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                                            {ICONS.Chart} Trajectory Matrix
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1">Revenue vs. Burn Rate (Trailing 8 Quarters)</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Revenue</div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><div className="w-3 h-3 rounded-full bg-rose-400"></div> Burn</div>
                                                    </div>
                                                </div>
                                                <div className="h-64 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={selectedStartup.revenue.map((v, i) => ({ 
                                                            name: `Q${i+1}`, 
                                                            Revenue: v * 1000, 
                                                            Burn: selectedStartup.burnRate[i] * 1000 
                                                        }))}>
                                                            <defs>
                                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                                                </linearGradient>
                                                                <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2}/>
                                                                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                                                                </linearGradient>
                                                            </defs>
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                                                            <YAxis hide domain={['dataMin', 'dataMax + 2000']} />
                                                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                                                            <RechartsTooltip 
                                                                contentStyle={{backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff', fontWeight: 'bold'}} 
                                                                formatter={(value) => formatCurrency(value)}
                                                            />
                                                            <Area type="monotone" dataKey="Revenue" stroke="#34d399" strokeWidth={4} fill="url(#colorRev)" />
                                                            <Area type="monotone" dataKey="Burn" stroke="#fb7185" strokeWidth={3} fill="url(#colorBurn)" strokeDasharray="5 5" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Right Col: Ask, Valuation, Cap Table */}
                                        <div className="space-y-6">
                                            
                                            {/* Primary Ask Card */}
                                            <div className="bg-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
                                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                                <div className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">The Ask</div>
                                                <div className="text-5xl font-black mb-2">{selectedStartup.ask}</div>
                                                <div className="inline-block px-3 py-1 bg-white/10 rounded-lg text-sm font-bold text-emerald-400 border border-white/5">
                                                    For {selectedStartup.equity} Equity
                                                </div>
                                                
                                                <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pre-Money Valuation</div>
                                                        <div className="text-2xl font-black">{selectedStartup.valuation}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Estimated Runway</div>
                                                        <div className="text-2xl font-black">{selectedStartup.runway}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cap Table Pie Chart */}
                                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Cap Table Structure</h4>
                                                <div className="h-48 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie 
                                                                data={selectedStartup.capTable} 
                                                                innerRadius={60} outerRadius={80} 
                                                                paddingAngle={5} dataKey="value"
                                                                stroke="none"
                                                            >
                                                                {selectedStartup.capTable.map((entry, index) => {
                                                                    const colors = ['#0f172a', '#10b981', '#3b82f6', '#f59e0b'];
                                                                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                                })}
                                                            </Pie>
                                                            <RechartsTooltip 
                                                                contentStyle={{borderRadius: '12px', border: 'none', fontWeight: 'bold'}}
                                                                formatter={(value) => `${value}%`}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-3 mt-2">
                                                    {selectedStartup.capTable.map((entry, idx) => {
                                                        const colors = ['bg-slate-900', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500'];
                                                        return (
                                                            <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`}></div>
                                                                {entry.name} ({entry.value}%)
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Team Info */}
                                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
                                                <div className="p-4 bg-slate-50 text-slate-500 rounded-2xl">{ICONS.Users}</div>
                                                <div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Founding Team Origin</div>
                                                    <div className="text-sm font-black text-slate-800">{selectedStartup.team}</div>
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