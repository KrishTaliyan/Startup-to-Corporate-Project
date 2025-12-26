import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";

/* ================= ICONS ================= */
const Icons = {
  ChevronRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  ArrowUpRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Constants (Upgraded)
  const brandGradient = "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
  const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300";
  const glassPanel = "bg-[#0A0A0F]/60 backdrop-blur-xl border border-white/10 shadow-2xl";

  return (
    // ✅ NEW THEME: Deep Space Black with Richer Gradients
    <div className="min-h-screen bg-[#030014] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* 🌌 ANIMATED BACKGROUND (Enhanced) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full blur-[150px] bg-indigo-900/40"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 100, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[130px] bg-purple-900/30"
          />
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#030014]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* BRANDING: INNOBRIDGE */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform ${brandGradient}`}>
                I
            </div>
            <span className="text-xl font-bold text-white tracking-tight">INNO<span className="font-light text-indigo-300">BRIDGE</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white hover:scale-105 transition-all">Process</a>
            <a href="#marketplace" className="hover:text-white hover:scale-105 transition-all">Marketplace</a>
            <a href="#pricing" className="hover:text-white hover:scale-105 transition-all">Pricing</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
            <Link to="/register" className={`text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all ${brandGradient}`}>Join Network</Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              The Operating System for Innovation
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              Bridge the gap between <span className={`font-black italic ${textGradient}`}>Capital</span> and <span className={`font-black italic ${textGradient}`}>Execution.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-12 font-light">
              InnoBridge simplifies the corporate-startup synergy. We use proprietary data to match Fortune 500 needs with verified, growth-stage solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/register" className={`h-14 px-10 rounded-full text-white font-bold flex items-center justify-center gap-2 text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform ${brandGradient}`}>
                  Get Started <Icons.ArrowUpRight />
              </Link>
              <Link to="/register" className="h-14 px-10 rounded-full border border-white/10 bg-white/5 text-white font-bold flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-sm backdrop-blur-md">
                  Corporate Partner
              </Link>
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/5 flex items-center gap-12 opacity-80">
                <div>
                    <p className="text-3xl font-black text-white">$2.4B+</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mt-1">Deal Flow</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-white">480+</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mt-1">Corporations</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-white">12h</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mt-1">Avg Match Time</p>
                </div>
            </div>
          </div>

          {/* Hero UI Mockup (Glass Card) */}
          <div className="relative hidden lg:block perspective-1000">
             <motion.div 
               initial={{ rotateY: -5, rotateX: 5 }}
               animate={{ rotateY: 5, rotateX: -5 }}
               transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
               className={`${glassPanel} rounded-[2rem] p-4`}
             >
                {/* Window Controls */}
                <div className="bg-black/40 rounded-t-2xl p-5 border-b border-white/5 flex justify-between items-center backdrop-blur-sm">
                    <div className="flex gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="h-1.5 w-24 bg-white/10 rounded-full"></div>
                </div>
                
                {/* List Items */}
                <div className="p-6 space-y-4">
                    {[
                        { name: "FinTech Hub", match: "98% Match", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
                        { name: "AI Logistics", match: "94% Match", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
                        { name: "Green Energy", match: "89% Match", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner ${brandGradient}`}>I</div>
                                <div>
                                    <span className="font-bold text-white text-base block">{item.name}</span>
                                    <span className="text-xs text-slate-500">Verified Partner</span>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${item.color}`}>{item.match}</span>
                        </div>
                    ))}
                    
                    <div className="h-24 w-full bg-indigo-500/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Awaiting Live Matches...</span>
                    </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <div className="py-16 border-y border-white/5 bg-black/40 z-10 relative backdrop-blur-sm">
         <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-16 md:gap-24 opacity-40 grayscale invert mix-blend-screen">
            {['VOLKSWAGEN', 'JP MORGAN', 'PALANTIR', 'TESLA', 'BOEING', 'AIRBUS'].map(brand => (
               <span key={brand} className="text-lg font-black tracking-tighter uppercase hover:text-white hover:opacity-100 transition-all cursor-default">{brand}</span>
            ))}
         </div>
      </div>

      {/* ================= FEATURES ================= */}
      <section id="how-it-works" className="py-32 px-6 relative z-10">
         <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Enterprise Scaling, <span className={textGradient}>Automated.</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">Skip the cold emails. InnoBridge verifies technical depth and financial health before the first meeting.</p>
         </div>
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { title: "Neural Audit", desc: "Our AI scans tech stacks and financial runway instantly to verify startup maturity.", icon: <Icons.Search /> },
              { title: "Smart Connect", desc: "Bridge the gap between startup solutions and specific corporate pain points.", icon: <Icons.Zap /> },
              { title: "Pilot Ready", desc: "Pre-executed legal frameworks reduce pilot onboarding time by up to 80%.", icon: <Icons.Check /> }
            ].map((feature, i) => (
              <div key={i} className={`${glassPanel} p-10 rounded-[2rem] hover:border-indigo-500/30 hover:-translate-y-2 transition-all duration-300 group`}>
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ring-1 ring-inset ring-white/10 shadow-lg">
                    {feature.icon}
                 </div>
                 <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                 <p className="text-base text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* ================= LIVE DEALS (Marketplace) ================= */}
      <section id="marketplace" className="py-32 px-6 bg-black/40 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Active Pipeline</h2>
                <p className="text-slate-400">Real-time sourcing mandates from global partners.</p>
              </div>
              <button className="text-xs font-bold text-indigo-400 flex items-center gap-2 hover:text-indigo-300 transition-colors uppercase tracking-widest border border-indigo-500/30 px-6 py-3 rounded-full hover:bg-indigo-500/10">
                View All <Icons.ChevronRight />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Generative AI for Legal", budget: "$150k Pilot", tag: "AI/SaaS", time: "2h ago" },
                { title: "Quantum Computing Grid", budget: "$400k Pilot", tag: "Infrastructure", time: "5h ago" },
                { title: "Bio-Synthetic Polymers", budget: "$100k Pilot", tag: "Materials", time: "1d ago" }
              ].map((deal, i) => (
                <div key={i} className={`${glassPanel} p-8 rounded-[2rem] hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all cursor-pointer group`}>
                   <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">{deal.tag}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{deal.time}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-8 group-hover:text-indigo-400 transition-colors leading-tight">{deal.title}</h3>
                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allocation</span>
                        <span className="text-lg font-mono font-bold text-white">{deal.budget}</span>
                   </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-32 px-6 relative z-10">
         <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            {/* Startup Card */}
            <div className={`${glassPanel} p-12 rounded-[2.5rem] relative overflow-hidden group hover:border-indigo-500/40 transition-colors`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] group-hover:bg-indigo-600/20 transition-all"></div>
               <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Founders</h3>
               <div className="text-5xl font-black text-white mb-8">$0<span className="text-lg text-slate-500 font-medium tracking-normal ml-2">/forever</span></div>
               <ul className="space-y-5 mb-10 text-sm text-slate-300 font-medium">
                  <li className="flex items-center gap-4"><div className="text-emerald-400 bg-emerald-400/10 p-1 rounded-full"><Icons.Check /></div> Global RFP Access</li>
                  <li className="flex items-center gap-4"><div className="text-emerald-400 bg-emerald-400/10 p-1 rounded-full"><Icons.Check /></div> Verified Audit Badge</li>
                  <li className="flex items-center gap-4"><div className="text-emerald-400 bg-emerald-400/10 p-1 rounded-full"><Icons.Check /></div> Unlimited Direct Messages</li>
               </ul>
               <Link to="/register" className="block w-full py-4 rounded-xl border border-indigo-500/30 text-indigo-300 font-bold text-center text-sm hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/25">Submit Pitch</Link>
            </div>
            
            {/* Corporate Card */}
            <div className="bg-[#0F172A] border border-cyan-500/30 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-1 ring-cyan-500/20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[80px]"></div>
               <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Corporates</h3>
               <div className="text-5xl font-black text-white mb-8 italic">Partner</div>
               <ul className="space-y-5 mb-10 text-sm text-slate-300 font-medium">
                  <li className="flex items-center gap-4"><div className="text-cyan-400 bg-cyan-400/10 p-1 rounded-full"><Icons.Check /></div> Bespoke Sourcing Engine</li>
                  <li className="flex items-center gap-4"><div className="text-cyan-400 bg-cyan-400/10 p-1 rounded-full"><Icons.Check /></div> Dedicated Node Support</li>
                  <li className="flex items-center gap-4"><div className="text-cyan-400 bg-cyan-400/10 p-1 rounded-full"><Icons.Check /></div> Private Sandbox Network</li>
               </ul>
               <Link to="/register" className="block w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-center text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20 uppercase tracking-widest">Initialize Contact</Link>
            </div>
         </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black/60 pt-24 pb-12 px-6 border-t border-white/5 relative z-10 backdrop-blur-lg">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20 text-sm">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-8">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black italic text-sm ${brandGradient}`}>I</div>
                  <span className="text-xl font-bold tracking-tight text-white">INNOBRIDGE</span>
               </div>
               <p className="text-slate-500 max-w-sm leading-relaxed">Redefining the industrial revolution through data-backed synergy. Secure, verifiable, and built for scale.</p>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8 text-xs uppercase tracking-widest">Network</h4>
               <ul className="space-y-4 text-slate-500 font-medium">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Marketplace</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Legal Framework</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Success Stories</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8 text-xs uppercase tracking-widest">Privacy</h4>
               <ul className="space-y-4 text-slate-500 font-medium">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Security Audit</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Data Protocol</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <p>© 2024 INNOBRIDGE GLOBAL. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
               <div className="flex items-center gap-2 text-emerald-500/80"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM: ONLINE</div>
            </div>
         </div>
      </footer>
    </div>
  );
}