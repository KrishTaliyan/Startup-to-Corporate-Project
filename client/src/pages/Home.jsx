import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // CONNECTS TO REAL ROUTES

/* ================= ICONS (Internal SVG System) ================= */
const Icons = {
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  ArrowUpRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>,
  Rocket: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  Building: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>,
  Lock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
};

export default function ConnectXPlatform() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-300 font-sans selection:bg-indigo-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }

        .glass {
          background: rgba(20, 21, 26, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .btn-primary {
          background: linear-gradient(180deg, #4F46E5 0%, #4338CA 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1) inset, 0 1px 2px rgba(0,0,0,0.4);
        }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .text-gradient {
            background: linear-gradient(to right, #ffffff, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-enter { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/15 rounded-full blur-[130px] z-0 pointer-events-none" />

      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#0B0C10]/90 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-lg shadow-indigo-500/30">C</div>
            <span className="text-xl font-bold text-white tracking-tight">Connect<span className="text-indigo-500">X</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#marketplace" className="hover:text-white transition-colors">Live Deals</a>
            <a href="#pricing" className="hover:text-white transition-colors">Membership</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-2">Log in</Link>
            <Link to="/register" className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 animate-enter">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
              <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
              Network Activity: High
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              The Operating System for <span className="text-gradient">Corporate Innovation</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg mb-10">
              Stop wasting months on LinkedIn and cold emails. ConnectX uses AI to match Series-B startups with Fortune 500 pilots in weeks, not years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary h-12 px-8 rounded-lg text-white font-medium flex items-center justify-center gap-2">I'm a Startup <Icons.ArrowUpRight /></Link>
              <Link to="/register" className="h-12 px-8 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors flex items-center justify-center">I'm a Corporate</Link>
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 flex gap-12">
               <div><div className="text-3xl font-bold text-white">500+</div><div className="text-xs text-slate-500 uppercase tracking-wider">Pilots Live</div></div>
               <div><div className="text-3xl font-bold text-white">$2.4B</div><div className="text-xs text-slate-500 uppercase tracking-wider">Deal Volume</div></div>
               <div><div className="text-3xl font-bold text-white">14d</div><div className="text-xs text-slate-500 uppercase tracking-wider">Avg Match Time</div></div>
            </div>
          </div>

          <div className="relative hidden lg:block">
             <div className="glass rounded-xl border border-white/10 p-1 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                <div className="bg-[#15161b] rounded-t-lg p-3 border-b border-white/5 flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20"></div><div className="w-3 h-3 rounded-full bg-yellow-500/20"></div><div className="w-3 h-3 rounded-full bg-green-500/20"></div></div>
                <div className="bg-[#0f1014] p-6 rounded-b-lg min-h-[350px]">
                   <div className="flex justify-between items-center mb-8">
                      <div><div className="text-xs text-slate-500 font-mono mb-1">DASHBOARD_V4</div><div className="text-white font-bold">Active Synergy Matches</div></div>
                      <div className="px-3 py-1 bg-indigo-600 text-white text-xs rounded font-bold">LIVE</div>
                   </div>
                   <div className="space-y-4">
                      {[
                        { name: "FinTech AI Solutions", corp: "Global Bank", match: "98%", status: "Pilot Signed", color: "text-emerald-400" },
                        { name: "GreenEnergy Grid", corp: "Utility Co.", match: "94%", status: "In Review", color: "text-yellow-400" },
                        { name: "SecureChain Logistics", corp: "Shipping Giant", match: "91%", status: "Meeting Set", color: "text-blue-400" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors cursor-default">
                           <div className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-white">{item.name[0]}</div>
                              <div><div className="text-sm font-bold text-white">{item.name}</div><div className="text-xs text-slate-500">Matched with {item.corp}</div></div>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-bold text-indigo-400">{item.match} Match</div>
                              <div className={`text-[10px] ${item.color} uppercase font-bold tracking-wider`}>{item.status}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 h-24 w-full bg-white/5 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end px-2 pb-2 gap-2">
                        {[40, 60, 30, 80, 50, 90, 70, 40].map((h, i) => (
                          <div key={i} style={{height: `${h}%`}} className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/50 transition-colors rounded-t-sm"></div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ================= LOGO STRIP ================= */}
      <div className="border-y border-white/5 bg-black/20 py-10 overflow-hidden">
         <div className="flex justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['MICROSOFT', 'ORACLE', 'STRIPE', 'SIEMENS', 'AIRBUS'].map(brand => (
               <div key={brand} className="text-xl font-black italic tracking-tighter text-white cursor-default">{brand}</div>
            ))}
         </div>
      </div>

      {/* ================= WORKFLOW (HOW IT WORKS) ================= */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0E0F14]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From Pitch to Pilot in <span className="text-indigo-500">3 Steps</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto">We've automated the due diligence and legal hurdles so you can focus on the tech.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
               {/* Connector Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent z-0"></div>
               
               {[
                 { title: "Profile & Vetting", desc: "Upload your pitch deck or RFP. Our AI verifies financials, tech stack, and legal standing instantly.", icon: <Icons.Search /> },
                 { title: "AI Synergy Match", desc: "Our algorithm finds the exact departmental pain point that matches your solution.", icon: <Icons.Zap /> },
                 { title: "Standardized Pilot", desc: "Skip legal review. Use our pre-approved MSA frameworks to start working immediately.", icon: <Icons.Check /> }
               ].map((step, i) => (
                 <div key={i} className="relative z-10 bg-[#0E0F14] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/40 transition-colors text-center group">
                    <div className="w-16 h-16 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 text-2xl mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                       {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ================= LIVE OPPORTUNITIES (MARKETPLACE) ================= */}
      <section id="marketplace" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-indigo-600/5 -skew-y-3 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Live Opportunities</h2>
               <p className="text-slate-400">Real-time RFPs from Fortune 500 partners.</p>
             </div>
             <Link to="/register" className="text-indigo-400 font-bold hover:text-white transition-colors flex items-center gap-2">View Full Market <Icons.ChevronRight /></Link>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
             {[
               { title: "Generative AI for Customer Support", budget: "$100k Pilot", industry: "FinTech", time: "2h ago" },
               { title: "Supply Chain Blockchain Tracking", budget: "$250k Pilot", industry: "Logistics", time: "5h ago" },
               { title: "Carbon Capture Measurement", budget: "$500k Pilot", industry: "Energy", time: "1d ago" },
               { title: "Autonomous Drone Security", budget: "$150k Pilot", industry: "Defense", time: "1d ago" },
               { title: "Predictive Maintenance IoT", budget: "$75k Pilot", industry: "Manufacturing", time: "2d ago" },
               { title: "Personalized Health Data API", budget: "$200k Pilot", industry: "Healthcare", time: "2d ago" }
             ].map((deal, i) => (
               <div key={i} className="glass p-6 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border-l-2 border-l-transparent hover:border-l-indigo-500">
                  <div className="flex justify-between items-start mb-4">
                     <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white uppercase tracking-wider">{deal.industry}</span>
                     <span className="text-xs text-slate-500">{deal.time}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{deal.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-emerald-400 font-mono bg-emerald-500/10 inline-block px-2 py-1 rounded">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> {deal.budget}
                  </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-24 px-6 bg-[#0E0F14]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-white">Membership Tiers</h2>
               <p className="text-slate-400">Choose your velocity.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               <div className="p-8 rounded-2xl border border-white/10 bg-black/20 hover:border-white/20 transition-all">
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Startup Access</h3>
                  <div className="text-4xl font-bold text-white mb-6">Free<span className="text-lg text-slate-500 font-normal">/forever</span></div>
                  <ul className="space-y-4 mb-8 text-sm text-slate-400">
                     <li className="flex gap-3"><span className="text-white"><Icons.Check /></span> Public Profile & Verification</li>
                     <li className="flex gap-3"><span className="text-white"><Icons.Check /></span> Access Open RFPs</li>
                     <li className="flex gap-3"><span className="text-white"><Icons.Check /></span> Standard Legal Templates</li>
                  </ul>
                  <Link to="/register" className="block w-full py-3 rounded-lg border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all text-center">Join as Startup</Link>
               </div>
               <div className="p-8 rounded-2xl border border-indigo-500/50 bg-indigo-900/10 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">ENTERPRISE</div>
                  <h3 className="text-lg font-medium text-indigo-200 mb-2">Corporate Partner</h3>
                  <div className="text-4xl font-bold text-white mb-6">Custom</div>
                  <ul className="space-y-4 mb-8 text-sm text-slate-300">
                     <li className="flex gap-3"><span className="text-indigo-400"><Icons.Check /></span> Dedicated Innovation Scout</li>
                     <li className="flex gap-3"><span className="text-indigo-400"><Icons.Check /></span> Private Deal Room</li>
                     <li className="flex gap-3"><span className="text-indigo-400"><Icons.Check /></span> White-glove Integration Support</li>
                  </ul>
                  <Link to="/register" className="block w-full btn-primary py-3 rounded-lg text-white font-bold text-center">Contact Sales</Link>
               </div>
            </div>
         </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-24 px-6 border-t border-white/5">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How does ConnectX verify startups?", a: "We connect directly to banking APIs and legal databases to verify revenue, runway, and incorporation status automatically. No manual data entry required." },
                { q: "Does ConnectX take equity?", a: "No. We charge a success fee on the pilot contract value to the corporation. Startups keep 100% of their equity and IP." },
                { q: "What is the average pilot size?", a: "The average pilot contract on ConnectX is $145,000 with a duration of 3-6 months." },
                { q: "Can I use my own legal contracts?", a: "Yes, Enterprise tier members can upload their own MSA templates, though using our standard framework accelerates closing by 70%." }
              ].map((item, i) => (
                <div key={i} className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
                   <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full text-left p-4 flex justify-between items-center text-white font-medium hover:bg-white/5 transition-colors">
                      {item.q}
                      <span className={`transform transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}>▼</span>
                   </button>
                   {activeFaq === i && <div className="p-4 text-sm text-slate-400 border-t border-white/5 bg-black/20">{item.a}</div>}
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto glass rounded-3xl p-12 text-center border border-indigo-500/30 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 blur-3xl -z-10"></div>
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Accelerate?</h2>
           <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">Join 5,000+ founders and 200+ enterprises building the future together.</p>
           <Link to="/register" className="inline-block btn-primary px-10 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-600/40 hover:scale-105 transition-transform">Get Started Now</Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#050507] pt-16 pb-8 px-6 text-sm">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold italic text-xs">C</div>
                  <span className="text-lg font-bold text-white">ConnectX</span>
               </div>
               <p className="text-slate-500 max-w-xs">Building the operating system for the next generation of industrial innovation. San Francisco, CA.</p>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Platform</h4>
               <ul className="space-y-2 text-slate-500">
                  <li className="hover:text-white cursor-pointer transition-colors">Marketplace</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Success Stories</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Legal</h4>
               <ul className="space-y-2 text-slate-500">
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Security (SOC2)</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600 text-xs">
            <p>© 2024 ConnectX Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <Icons.Globe /> <span className="hover:text-white cursor-pointer">English (US)</span>
            </div>
         </div>
      </footer>
    </div>
  );
}