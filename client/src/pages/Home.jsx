import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; 
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

/* ============================================================================
   1. MASSIVE AESTHETIC ICON LIBRARY (Warm Tones)
============================================================================ */
const Icons = {
  ArrowRight: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ArrowUpRight: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>,
  Check: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>,
  Zap: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Search: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ChevronDown: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>,
  Shield: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Code: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Cpu: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg>,
  Info: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
};

/* ============================================================================
   2. EXPANDED DATABASE (MOCK)
============================================================================ */
const DATA = {
  mandates: [
    { id: 1, title: "Next-Gen Bio-Polymers", company: "EcoIndustries", budget: "$250k Pilot", tag: "Green Tech", time: "Just now", match: 98 },
    { id: 2, title: "Automated Workflow AI", company: "FinServe Global", budget: "$120k Pilot", tag: "AI/SaaS", time: "2h ago", match: 94 },
    { id: 3, title: "Supply Chain Ledger", company: "LogiCorp", budget: "$500k Scale", tag: "FinTech", time: "5h ago", match: 89 },
    { id: 4, title: "Carbon Capture Mesh", company: "AeroSpace Dynamics", budget: "$800k Pilot", tag: "Green Tech", time: "1d ago", match: 85 },
    { id: 5, title: "Neural Marketing Engine", company: "AdVantage", budget: "$90k Pilot", tag: "AI/SaaS", time: "2d ago", match: 82 },
    { id: 6, title: "Micro-Lending API", company: "Capital Nodes", budget: "$150k Seed", tag: "FinTech", time: "3d ago", match: 78 },
    { id: 7, title: "Quantum Key Distribution", company: "SecurVault", budget: "$1.2M Series A", tag: "Security", time: "4d ago", match: 99 },
    { id: 8, title: "Agri-Tech Soil Sensors", company: "FarmGlobal", budget: "$300k Pilot", tag: "Green Tech", time: "1w ago", match: 88 }
  ],
  faqs: [
    { q: "How does the synergy algorithm evaluate my MERN code?", a: "Our proprietary engine scans your GitHub repositories, analyzing React component architecture, Node.js API efficiency, and MongoDB schema design to generate a live Synergy Score against enterprise mandates." },
    { q: "Is the platform actually free for developers?", a: "Yes. We believe talent shouldn't pay a toll. Enterprises pay the licensing and pilot integration fees. You keep 100% of your contract value." },
    { q: "What happens when I hit a 90%+ match?", a: "The system automatically drafts a secure NDA and schedules a direct video bridge with the enterprise decision-maker, completely bypassing standard HR filters." },
    { q: "Can I use this for non-MERN stacks?", a: "Currently, our deepest integration is built for the MERN/PERN ecosystem, but we are rolling out support for Python/Django and Go architectures next quarter." }
  ]
};

/* ============================================================================
   3. INTERNAL COMPONENTS (To keep code clean but massive)
============================================================================ */

// A. Notification Toast System
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-10 right-10 z-[9999] flex items-center gap-3 bg-stone-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-stone-800"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
        {type === 'success' ? <Icons.Check className="w-5 h-5" /> : <Icons.Info className="w-5 h-5" />}
      </div>
      <p className="font-bold text-sm tracking-wide">{message}</p>
    </motion.div>
  );
};

// B. Smooth Number Counter
const CountUp = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else setCount(Math.floor(start));
      }, 16);
    }
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

/* ============================================================================
   4. MAIN APPLICATION COMPONENT
============================================================================ */
export default function Home() {
  /* --- STATE MANAGEMENT --- */
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Layout States
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activeFaq, setActiveFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  /* --- EFFECTS --- */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    });
  };

  const triggerToast = (msg) => {
    setToastMessage(null); // Reset
    setTimeout(() => setToastMessage(msg), 50);
  };

  /* --- DERIVED DATA --- */
  const filters = ["All", "AI/SaaS", "FinTech", "Green Tech", "Security"];
  const filteredDeals = DATA.mandates.filter(deal => {
    const matchesFilter = activeFilter === "All" || deal.tag === activeFilter;
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || deal.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /* --- THEME CONSTANTS --- */
  const brandGradient = "bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400";
  const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500";
  const glassPanel = "bg-white/70 backdrop-blur-2xl border border-white shadow-[0_20px_40px_rgba(225,29,72,0.05)]";

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-600 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden relative" onMouseMove={handleMouseMove}>
      
      {/* 🌌 DYNAMIC 3D BACKGROUND (FIXED FOR VITE FAST REFRESH) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#FDFCFB]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FDFCFB] via-[#FFF5F5] to-[#FDFBF7]"></div>
          <motion.div 
            animate={{ x: mousePosition.x * 2.5, y: mousePosition.y * 2.5 }} 
            transition={{ type: "spring", stiffness: 40, damping: 20 }} 
            className="absolute -top-[10%] -left-[10%] w-[900px] h-[900px] rounded-full blur-[140px] bg-rose-200/30 mix-blend-multiply" 
          />
          <motion.div 
            animate={{ x: mousePosition.x * -2, y: mousePosition.y * -2 }} 
            transition={{ type: "spring", stiffness: 30, damping: 25 }} 
            className="absolute bottom-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full blur-[160px] bg-amber-100/40 mix-blend-multiply" 
          />
          <motion.div 
            animate={{ x: mousePosition.x * 1.5, y: mousePosition.y * 1.5, rotate: [0, 5, -5, 0] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
            className="absolute top-[30%] left-[20%] w-[700px] h-[700px] rounded-[30%] blur-[120px] bg-emerald-50/50 mix-blend-multiply" 
          />
          <div className="absolute inset-0 opacity-[0.2] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-stone-200/60 py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-[90rem] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform ${brandGradient}`}>I</div>
            <span className="text-2xl font-black text-stone-800 tracking-tighter">INNO<span className="font-light text-rose-500">BRIDGE</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10 bg-white/60 backdrop-blur-md px-8 py-3.5 rounded-full border border-stone-200 shadow-sm">
            <a href="#architecture" className="text-sm font-bold text-stone-500 hover:text-rose-500 transition-colors">Architecture</a>
            <a href="#pipeline" className="text-sm font-bold text-stone-500 hover:text-rose-500 transition-colors">Pipeline</a>
            <a href="#stats" className="text-sm font-bold text-stone-500 hover:text-rose-500 transition-colors">Metrics</a>
            <a href="#pricing" className="text-sm font-bold text-stone-500 hover:text-rose-500 transition-colors">Deployment</a>
          </div>

          <div className="flex items-center gap-4 relative z-50">
            {/* ✅ FIXED: React-Router-Dom Links for Authentication */}
            <Link to="/login" className="text-sm font-bold text-stone-600 hover:text-rose-600 px-4 py-2 transition-colors cursor-pointer">
              Sign In
            </Link>
            <Link to="/register" className={`text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-1 transition-all cursor-pointer ${brandGradient}`}>
              Initialize Terminal
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ================= 3D HERO SECTION ================= */}
        <section className="pt-48 pb-32 px-6 min-h-[95vh] flex items-center">
          <motion.div style={{ y: heroY }} className="max-w-[90rem] mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
            <div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest mb-10 shadow-sm">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                Engine v3.0 Online
              </div>
              
              <h1 className="text-6xl md:text-[5.5rem] font-black text-stone-800 tracking-tighter leading-[1.05] mb-8">
                Where <span className="italic font-light text-stone-500">Ideas</span> meet <br/>
                <span className={textGradient}>Execution.</span>
              </h1>
              
              <p className="text-xl text-stone-500 leading-relaxed max-w-xl mb-12 font-medium">
                The only platform bridging elite MERN developers with Fortune 500 capital. Skip the interviews. Deploy your code.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                {/* ✅ FIXED: React-Router-Dom Link */}
                <Link to="/register" className="h-16 px-10 rounded-full text-white font-black flex items-center justify-center gap-3 text-base shadow-2xl shadow-rose-500/25 hover:scale-105 transition-all bg-stone-900 cursor-pointer">
                    Deploy Profile <Icons.ArrowUpRight className="w-5 h-5" />
                </Link>
                <button type="button" onClick={() => document.getElementById('pipeline').scrollIntoView({ behavior: 'smooth' })} className="h-16 px-10 rounded-full border-2 border-stone-200 bg-white text-stone-700 font-black flex items-center justify-center hover:border-rose-300 hover:text-rose-600 transition-all text-base cursor-pointer">
                    Explore Pipeline
                </button>
              </div>
            </div>

            {/* Interactive 3D Parallax Widget */}
            <motion.div style={{ x: mousePosition.x * -1.2, y: mousePosition.y * -1.2 }} className="hidden lg:block perspective-1000 relative">
               <motion.div initial={{ rotateY: -10, rotateX: 10 }} animate={{ rotateY: 10, rotateX: -10 }} transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} className="bg-white/80 backdrop-blur-3xl border border-white shadow-[0_40px_100px_rgba(225,29,72,0.15)] rounded-[3rem] p-6 max-w-lg ml-auto">
                  <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm mb-6 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Active Sync</p>
                        <p className="text-xl font-black text-stone-800">FinTech Ledger API</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                        <Icons.Cpu className="w-7 h-7" />
                      </div>
                  </div>
                  <div className="bg-stone-900 rounded-[2rem] p-6 shadow-inner relative overflow-hidden text-left">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500"></div>
                    <div className="flex gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                      <p className="text-stone-400">~ inno-cli init <span className="text-rose-400">--stack mern</span></p>
                      <p className="text-emerald-400 flex items-center gap-2"><Icons.Check className="w-4 h-4"/> Fetching GitHub commits...</p>
                      <p className="text-emerald-400 flex items-center gap-2"><Icons.Check className="w-4 h-4"/> Validating React architecture...</p>
                      <div className="mt-6 p-4 rounded-xl border border-stone-700 bg-stone-800/50">
                        <p className="text-white font-bold mb-2">Synergy Match: <span className="text-amber-400">98.4%</span></p>
                        <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "98.4%" }} transition={{ duration: 2, delay: 1 }} className="h-full bg-gradient-to-r from-rose-500 to-amber-500"></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
               </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section id="stats" className="py-20 border-y border-stone-200 bg-white/60 backdrop-blur-xl">
          <div className="max-w-[90rem] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-stone-200">
            <div>
              <p className="text-4xl md:text-5xl font-black text-stone-800 mb-2"><CountUp prefix="$" end={2} suffix=".4B" /></p>
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Deal Flow Processed</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-stone-800 mb-2"><CountUp end={480} suffix="+" /></p>
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Enterprise Partners</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-stone-800 mb-2"><CountUp end={94} suffix="%" /></p>
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Average Match Rate</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-stone-800 mb-2"><CountUp end={12} suffix="h" /></p>
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Pilot Approval Time</p>
            </div>
          </div>
        </section>

        {/* ================= ARCHITECTURE / FEATURES ================= */}
        <section id="architecture" className="py-32 px-6">
          <div className="max-w-[90rem] mx-auto text-center mb-24">
            <h2 className="text-5xl font-black text-stone-800 tracking-tighter mb-6">Built for <span className={textGradient}>Engineers.</span></h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto font-medium">We abstracted away recruiters, whiteboarding, and waiting. Just clean code and verified capital.</p>
          </div>
          <div className="max-w-[90rem] mx-auto grid md:grid-cols-3 gap-8">
            {[
              { title: "Neural Code Audit", desc: "Our AI scans tech stacks and GitHub commits instantly to verify startup maturity.", icon: <Icons.Code className="w-8 h-8"/>, bg: "bg-rose-50", color: "text-rose-500" },
              { title: "Smart Connect", desc: "Directly bridge the gap between startup solutions and specific corporate pain points.", icon: <Icons.Zap className="w-8 h-8"/>, bg: "bg-amber-50", color: "text-amber-500" },
              { title: "Legal Automator", desc: "Pre-executed legal frameworks reduce pilot onboarding time by up to 80%.", icon: <Icons.Shield className="w-8 h-8"/>, bg: "bg-emerald-50", color: "text-emerald-500" }
            ].map((feat, i) => (
              <div key={i} className={`${glassPanel} p-12 rounded-[2.5rem] hover:-translate-y-3 transition-transform duration-500 group`}>
                 <div className={`w-16 h-16 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-8 border border-white shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    {feat.icon}
                 </div>
                 <h3 className="text-2xl font-black text-stone-800 mb-4">{feat.title}</h3>
                 <p className="text-stone-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PIPELINE (MARKETPLACE) ================= */}
        <section id="pipeline" className="py-32 px-6 bg-white/40 border-y border-stone-200">
          <div className="max-w-[90rem] mx-auto">
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                <div>
                  <h2 className="text-5xl font-black text-stone-800 tracking-tighter mb-4">Active Pipeline</h2>
                  <p className="text-stone-500 font-medium text-lg">Real-time sourcing mandates from global enterprise partners.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center w-full lg:w-auto">
                  <div className="relative w-full md:w-72">
                    <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <input 
                      type="text" placeholder="Search mandates..." 
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all font-bold text-stone-700 shadow-sm"
                    />
                  </div>
                  
                  {/* Clean Filter Tags Layout */}
                  <div className="flex flex-wrap gap-3">
                    {filters.map(filter => (
                      <button 
                        key={filter} 
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-3.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                          activeFilter === filter 
                            ? 'bg-stone-900 text-white shadow-md' 
                            : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-300 hover:text-stone-800'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Filtered Data Grid */}
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredDeals.length > 0 ? filteredDeals.map((deal) => (
                    <motion.div 
                      layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                      key={deal.id} 
                      onClick={() => triggerToast(`Connecting to ${deal.company}...`)}
                      className={`${glassPanel} p-8 rounded-[2rem] hover:border-rose-300 hover:shadow-[0_20px_40px_rgba(225,29,72,0.1)] transition-all cursor-pointer group flex flex-col`}
                    >
                       <div className="flex justify-between items-start mb-6">
                          <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-stone-200 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                            {deal.tag}
                          </span>
                          <span className="text-xs text-stone-400 font-bold">{deal.time}</span>
                       </div>
                       <h3 className="text-xl font-black text-stone-800 mb-2 group-hover:text-rose-500 transition-colors leading-tight">{deal.title}</h3>
                       <p className="text-sm text-stone-500 font-medium mb-8 flex-grow">{deal.company}</p>
                       
                       <div className="mb-6">
                         <div className="flex justify-between text-xs font-bold text-stone-500 mb-2">
                           <span>Synergy Match</span>
                           <span className="text-stone-800">{deal.match}%</span>
                         </div>
                         <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: `${deal.match}%` }}></div>
                         </div>
                       </div>
                       <div className="flex items-end justify-between pt-6 border-t border-stone-100">
                            <div>
                              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Allocation</span>
                              <span className="text-xl font-black text-stone-800">{deal.budget}</span>
                            </div>
                            <button type="button" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all">
                              <Icons.ArrowUpRight className="w-5 h-5" />
                            </button>
                       </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-2xl font-bold text-stone-400 mb-4">No mandates found matching criteria.</p>
                      <button type="button" onClick={() => {setActiveFilter("All"); setSearchQuery("");}} className="text-rose-500 font-bold hover:underline cursor-pointer">Clear Filters</button>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
          </div>
        </section>

        {/* ================= FUNCTIONAL PRICING ================= */}
        <section id="pricing" className="py-32 px-6 bg-stone-950 text-white border-y border-stone-800">
           <div className="max-w-5xl mx-auto text-center mb-16">
              <h2 className="text-5xl font-black tracking-tighter mb-8">Transparent Architecture</h2>
              <div className="inline-flex items-center p-1.5 bg-stone-900 border border-stone-800 rounded-full">
                <button type="button" onClick={() => setBillingCycle('monthly')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${billingCycle === 'monthly' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'}`}>Monthly</button>
                <button type="button" onClick={() => setBillingCycle('annually')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${billingCycle === 'annually' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'}`}>
                  Annually <span className="ml-2 text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
              </div>
           </div>

           <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
              <div className="bg-stone-900 p-12 rounded-[2.5rem] border border-stone-800">
                 <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4">Developers</h3>
                 <div className="text-6xl font-black mb-8">$0<span className="text-lg text-stone-500 font-bold ml-2">/forever</span></div>
                 <ul className="space-y-6 mb-10 text-base text-stone-300 font-medium">
                    <li className="flex items-center gap-4"><div className="text-rose-400"><Icons.Check /></div> Full MERN Stack Support</li>
                    <li className="flex items-center gap-4"><div className="text-rose-400"><Icons.Check /></div> Portfolio Integration</li>
                    <li className="flex items-center gap-4"><div className="text-rose-400"><Icons.Check /></div> Direct RFP Access</li>
                 </ul>
                 {/* ✅ FIXED: React-Router-Dom Link */}
                 <Link to="/register" className="block w-full py-5 rounded-2xl border-2 border-stone-700 text-center font-black hover:bg-white hover:text-stone-900 transition-all uppercase tracking-widest cursor-pointer">
                   Create Profile
                 </Link>
              </div>
              
              <div className="bg-stone-800 p-12 rounded-[2.5rem] border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[80px]"></div>
                 <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-4">Enterprise</h3>
                 <div className="text-6xl font-black mb-8">
                   ${billingCycle === 'monthly' ? '4,999' : '3,999'}<span className="text-lg text-stone-400 font-bold ml-2">/mo</span>
                 </div>
                 <ul className="space-y-6 mb-10 text-base text-stone-300 font-medium relative z-10">
                    <li className="flex items-center gap-4"><div className="text-amber-400"><Icons.Check /></div> Dedicated Node Support</li>
                    <li className="flex items-center gap-4"><div className="text-amber-400"><Icons.Check /></div> AI Verification Audit</li>
                    <li className="flex items-center gap-4"><div className="text-amber-400"><Icons.Check /></div> Private Sandbox Network</li>
                 </ul>
                 {/* ✅ FIXED: React-Router-Dom Link */}
                 <Link to="/register" className="block w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-stone-900 text-center font-black hover:scale-[1.02] transition-transform uppercase tracking-widest relative z-10 cursor-pointer">
                   Initialize Contact
                 </Link>
              </div>
           </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-stone-800 tracking-tighter mb-12 text-center">System Queries</h2>
            <div className="space-y-4">
              {DATA.faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)} 
                    className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-stone-800 text-lg pr-4">{faq.q}</span>
                    <Icons.ChevronDown className={`w-6 h-6 text-stone-400 transition-transform flex-shrink-0 ${activeFaq === i ? 'rotate-180 text-rose-500' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-6 text-stone-500 font-medium leading-relaxed">
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-stone-200 relative z-10">
         <div className="max-w-[90rem] mx-auto grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-8">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black italic text-lg ${brandGradient}`}>I</div>
                  <span className="text-2xl font-black tracking-tighter text-stone-800">INNOBRIDGE</span>
               </div>
               <p className="text-stone-500 max-w-sm font-medium leading-relaxed">Redefining the industrial revolution through data-backed synergy. MERN optimized. Built for scale.</p>
            </div>
            <div>
               <h4 className="text-stone-800 font-black mb-6 text-xs uppercase tracking-widest">Architecture</h4>
               <ul className="space-y-4 text-stone-500 font-medium text-sm">
                  <li className="hover:text-rose-500 cursor-pointer">Synergy Algorithm</li>
                  <li className="hover:text-rose-500 cursor-pointer">Live Marketplace</li>
                  <li className="hover:text-rose-500 cursor-pointer">Legal Sandbox</li>
               </ul>
            </div>
            <div>
               <h4 className="text-stone-800 font-black mb-6 text-xs uppercase tracking-widest">Protocol</h4>
               <ul className="space-y-4 text-stone-500 font-medium text-sm">
                  <li className="hover:text-rose-500 cursor-pointer">Security Audit</li>
                  <li className="hover:text-rose-500 cursor-pointer">Terms of Service</li>
                  <li className="hover:text-rose-500 cursor-pointer">Privacy Framework</li>
               </ul>
            </div>
         </div>
         <div className="max-w-[90rem] mx-auto pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            <p>© 2026 INNOBRIDGE GLOBAL. COMPILED SUCCESSFULLY.</p>
            <p>Krish Taliyan</p>
            <div className="flex gap-2 mt-4 md:mt-0 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-0.5"></span> ALL SYSTEMS NOMINAL
            </div>
         </div>
      </footer>

      {/* TOAST NOTIFICATIONS (Kept for Marketplace Interactions) */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

    </div>
  );
}