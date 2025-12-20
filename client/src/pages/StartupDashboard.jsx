import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// ✅ 1. FAKE DATA CONSTANTS (Added to fill the page)
const MOCK_OPPORTUNITIES = [
  { _id: "1", title: "AI-Driven Logistics Optimization", companyName: "Amazon Web Services", industry: "AI & Logistics", budget: "$150k Pilot", description: "Looking for startups to optimize last-mile delivery using predictive AI models." },
  { _id: "2", title: "Decentralized Identity Verification", companyName: "Goldman Sachs", industry: "Fintech", budget: "$200k Pilot", description: "Seeking blockchain-based identity solutions for secure onboarding of high-net-worth clients." },
  { _id: "3", title: "Sustainable Packaging Materials", companyName: "Coca-Cola", industry: "Retail", budget: "$75k Pilot", description: "Innovation challenge for biodegradable packaging solutions to reduce plastic waste by 30%." },
  { _id: "4", title: "Remote Patient Monitoring API", companyName: "Pfizer", industry: "Health", budget: "$120k Pilot", description: "We need a seamless API integration for wearable devices to monitor clinical trial patients remotely." },
  { _id: "5", title: "Autonomous Drone Surveillance", companyName: "Tesla", industry: "Automotive", budget: "$300k Pilot", description: "Security solutions for gigafactory perimeters using autonomous drone swarms." },
  { _id: "6", title: "Generative AI for Legal Contracts", companyName: "Deloitte", industry: "AI", budget: "$100k Pilot", description: "Automating contract review and risk assessment using LLMs." }
];

const MOCK_MY_APPS = [
  { _id: "a1", opportunityId: { title: "Blockchain Loyalty Program", companyName: "Starbucks" }, status: "Accepted", appliedAt: "2023-11-01", corporateId: "c1" },
  { _id: "a2", opportunityId: { title: "AI Customer Support Bot", companyName: "Uber" }, status: "Pending", appliedAt: "2023-11-05", corporateId: "c2" },
  { _id: "a3", opportunityId: { title: "Smart Grid Analysis", companyName: "Shell" }, status: "Rejected", appliedAt: "2023-10-20", corporateId: "c3" },
];

const MOCK_NOTIFICATIONS = [
  { _id: "n1", type: "success", message: "Your proposal to Starbucks was accepted!", createdAt: new Date().toISOString(), isRead: false },
  { _id: "n2", type: "info", message: "Goldman Sachs viewed your profile.", createdAt: new Date(Date.now() - 3600000).toISOString(), isRead: false },
  { _id: "n3", type: "error", message: "Please update your tax documents.", createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true },
];

export default function StartupDashboard() {
  const { user, logout } = useAuth();

  // ✅ Initialize with Mock Data
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [myApps, setMyApps] = useState(MOCK_MY_APPS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const [activeView, setActiveView] = useState("Marketplace"); 
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  const token = localStorage.getItem("token");

  const viewsData = [
    { day: 'Mon', views: 12 },
    { day: 'Tue', views: 19 },
    { day: 'Wed', views: 3 },
    { day: 'Thu', views: 25 },
    { day: 'Fri', views: 32 },
    { day: 'Sat', views: 10 },
    { day: 'Sun', views: 8 },
  ];

  useEffect(() => {
    // Keeping this interval for realism, but disabling real fetch for demo
    // const interval = setInterval(fetchNotifications, 5000);
    // return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    // Mock Fetch Logic
    // setOpportunities(MOCK_OPPORTUNITIES);
    // setMyApps(MOCK_MY_APPS);
  };

  const handleApply = async (id) => {
    // Fake API Call
    alert("🚀 Proposal Sent!"); 
    // Add to myApps locally for demo
    const opp = opportunities.find(o => o._id === id);
    if(opp) {
        setMyApps([...myApps, { 
            _id: Date.now(), 
            opportunityId: { title: opp.title, companyName: opp.companyName }, 
            status: "Pending", 
            appliedAt: new Date().toISOString() 
        }]);
    }
  };
  
  const toggleSave = (id) => {
    if (savedIds.includes(id)) {
        setSavedIds(savedIds.filter(sid => sid !== id));
    } else {
        setSavedIds([...savedIds, id]);
    }
  };

  const markRead = async () => {
    setShowNotif(!showNotif);
    if (!showNotif) {
       setNotifications(notifications.map(n => ({...n, isRead: true})));
    }
  };

  const getMatchScore = (oppIndustry) => {
    if (!user.industry) return 65; 
    if (oppIndustry.toLowerCase().includes(user.industry.toLowerCase())) return 98;
    return Math.floor(Math.random() * (85 - 60) + 60);
  };

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || opp.industry.includes(filter) || (filter === "Saved" && savedIds.includes(opp._id));
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-screen bg-[#0B0C10] text-slate-300 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#101116] border-r border-white/5 flex flex-col z-20 hidden md:flex">
         <div className="p-6">
            <div className="flex items-center gap-3 font-bold text-white text-xl tracking-tight">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">S</div>
               Startup<span className="text-indigo-500">Hub</span>
            </div>
         </div>

         {/* Mini Profile */}
         <div className="px-4 mb-6">
            <div className="bg-[#1f2937]/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                    {user.companyName ? user.companyName[0] : "U"}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm truncate w-24">{user.companyName || "My Startup"}</div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Pro Account</div>
                  </div>
               </div>
               
               <div className="mt-4 flex items-center gap-2 mb-2">
                   <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                       <div className="bg-indigo-500 h-full w-[80%]"></div>
                   </div>
                   <span className="text-[10px] text-indigo-400">80%</span>
               </div>
               <div className="text-[10px] text-slate-500 text-center">Profile Completeness</div>

               <div className="h-10 w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={viewsData}>
                     <Bar dataKey="views" fill="#6366f1" radius={[2, 2, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="text-[10px] text-slate-500 mt-1 text-center">Profile Views (This Week)</div>
            </div>
         </div>

         <nav className="flex-1 px-4 space-y-1">
            <button onClick={() => setActiveView("Marketplace")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeView === "Marketplace" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "hover:bg-white/5 text-slate-400"}`}><span>🚀</span> Explore Pilots</button>
            <button onClick={() => setActiveView("MyApps")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeView === "MyApps" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "hover:bg-white/5 text-slate-400"}`}><span>📂</span> My Proposals <span className="ml-auto bg-white/10 px-2 py-0.5 rounded text-[10px]">{myApps.length}</span></button>
            <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-400 transition-all"><span>⚙️</span> Settings & Profile</Link>
         </nav>
         
         <div className="p-4 border-t border-white/5">
            <button onClick={logout} className="w-full py-2.5 border border-white/10 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center gap-2">🛑 Sign Out</button>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
         <div className="h-64 bg-gradient-to-r from-indigo-900 via-[#15161b] to-[#0B0C10] absolute top-0 left-0 w-full z-0 pointer-events-none"></div>
         
         <div className="relative z-10 p-8 max-w-7xl mx-auto">
           
           {/* HEADER */}
           <header className="flex justify-between items-end mb-8">
              <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{duration:0.5}}>
                 <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">Founder Console</div>
                 <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
                 <p className="text-slate-400">Here is what's happening in the corporate ecosystem today.</p>
              </motion.div>
              
              <div className="relative">
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={markRead} className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5">
                  🔔 
                  {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white border border-black font-bold animate-bounce">{unreadCount}</span>}
                </motion.button>
                <AnimatePresence>
                {showNotif && (
                  <motion.div 
                    initial={{opacity:0, y:-10, scale: 0.95}} 
                    animate={{opacity:1, y:0, scale: 1}} 
                    exit={{opacity: 0, scale: 0.95}}
                    className="absolute right-0 mt-2 w-80 bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                     <div className="p-3 border-b border-white/10 font-bold text-white text-sm bg-black/20 flex justify-between"><span>Notifications</span><span className="text-xs text-slate-400">{notifications.length} total</span></div>
                     <div className="max-h-64 overflow-y-auto">
                       {notifications.length === 0 ? <div className="p-6 text-center text-xs text-slate-500">No new alerts</div> : (
                          notifications.map(n => (
                             <div key={n._id} className={`p-3 border-b border-white/5 text-xs ${n.isRead ? 'opacity-50' : 'bg-indigo-500/10'}`}>
                                <div className={`font-bold mb-1 ${n.type === 'success' ? 'text-green-400' : n.type === 'error' ? 'text-red-400' : 'text-blue-400'}`}>{n.type === 'success' ? '✅ Success' : n.type === 'error' ? '⚠️ Update' : 'ℹ️ Info'}</div>
                                <div className="text-slate-300">{n.message}</div>
                                <div className="text-[10px] text-slate-600 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</div>
                             </div>
                          ))
                       )}
                     </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
           </header>

           {/* MARKETPLACE VIEW */}
           {activeView === "Marketplace" && (
             <>
               <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#15161b] border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-4 mb-8 sticky top-4 z-40 shadow-2xl backdrop-blur-md bg-opacity-90">
                  <div className="flex-1 relative">
                     <span className="absolute left-4 top-3.5 text-slate-500">🔍</span>
                     <input className="w-full bg-[#0B0C10] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all" placeholder="Search opportunities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
                     {['All', 'Saved', 'Fintech', 'Health', 'AI', 'Retail'].map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all whitespace-nowrap ${filter === cat ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-slate-400 hover:text-white'}`}>
                            {cat === 'Saved' && '⭐ '}{cat}
                        </button>
                     ))}
                  </div>
               </motion.div>
               
               <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="show"
                 layout
                 className="grid lg:grid-cols-2 gap-6 pb-20"
               >
                  <AnimatePresence>
                  {filteredOpps.length === 0 ? (
                     <motion.div initial={{opacity:0}} animate={{opacity:1}} className="col-span-2 py-20 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                        <div className="text-4xl mb-2">🔭</div>
                        <div className="text-slate-500">No matching challenges found.</div>
                     </motion.div>
                  ) : (
                     filteredOpps.map((opp, index) => {
                        const score = getMatchScore(opp.industry);
                        const isTrending = index % 3 === 0; 
                        return (
                          <motion.div 
                            key={opp._id} 
                            layout 
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.5)" }}
                            className="bg-[#15161b] rounded-2xl border border-white/5 p-6 shadow-lg transition-all group relative cursor-pointer overflow-hidden"
                          >
                             <button onClick={(e) => { e.stopPropagation(); toggleSave(opp._id); }} className="absolute top-4 left-4 z-20 text-xl hover:scale-110 transition-transform">
                                {savedIds.includes(opp._id) ? "⭐" : "☆"}
                             </button>

                             <div className="absolute top-4 right-4 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-center backdrop-blur-md">
                                <div className={`text-sm font-black ${score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{score}%</div>
                                <div className="text-[8px] uppercase text-slate-500 font-bold">Match</div>
                             </div>
                             
                             <div className="flex gap-4 items-center mb-4 pl-8">
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-xl font-black text-black shadow-lg">{opp.companyName[0]}</div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{opp.title}</h3>
                                      {isTrending && <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">🔥 Hot</span>}
                                   </div>
                                   <div className="text-sm text-slate-400">{opp.companyName} • {opp.industry}</div>
                                </div>
                             </div>
                             <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2">{opp.description}</p>
                             <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-mono font-bold text-xs">{opp.budget}</span>
                                <motion.button whileTap={{scale:0.95}} onClick={() => handleApply(opp._id)} className="bg-white text-black hover:bg-indigo-600 hover:text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-lg">Apply Now</motion.button>
                             </div>
                          </motion.div>
                        );
                     })
                  )}
                  </AnimatePresence>
               </motion.div>
             </>
           )}

           {/* MY APPLICATIONS VIEW */}
           {activeView === "MyApps" && (
             <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-[#15161b] rounded-2xl border border-white/10 overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                   <h2 className="text-xl font-bold text-white">Application History</h2>
                   <div className="text-xs text-slate-400">{myApps.length} Records</div>
                </div>
                {myApps.length === 0 ? (
                   <div className="text-center p-20 text-slate-500">No applications found.</div>
                ) : (
                   <table className="w-full text-left">
                      <thead className="bg-black/20 text-xs uppercase text-slate-500 font-bold"><tr><th className="p-5">Company</th><th className="p-5">Opportunity</th><th className="p-5">Date</th><th className="p-5 text-right">Status</th></tr></thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                         {myApps.map((app) => (
                            <tr key={app._id} className="hover:bg-white/5 transition-colors">
                               <td className="p-5 font-bold text-white">{app.opportunityId?.companyName}</td>
                               <td className="p-5 text-slate-300">{app.opportunityId?.title}</td>
                               <td className="p-5 text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                               <td className="p-5 text-right">
                                  {app.status === 'Accepted' ? (
                                     <Link to="/chat" state={{ partnerId: app.corporateId, partnerName: app.opportunityId?.companyName }} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg font-bold text-white text-xs transition-colors shadow-lg">💬 Chat Now</Link>
                                  ) : (
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${app.status === 'Rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{app.status}</span>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                )}
             </motion.div>
           )}
           
         </div>
      </main>
    </div>
  );
}