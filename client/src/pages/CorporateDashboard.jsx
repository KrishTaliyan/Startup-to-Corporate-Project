import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// ✅ 1. FAKE DATA CONSTANTS (Added this so the dashboard looks full)
const MOCK_APPLICANTS = [
  { _id: "1", startupName: "Nebula AI", startupId: "s1", status: "Pending", appliedAt: "2023-10-24", opportunityId: { title: "Generative AI for Customer Support" } },
  { _id: "2", startupName: "GreenSpark Energy", startupId: "s2", status: "Accepted", appliedAt: "2023-10-20", opportunityId: { title: "Sustainable Supply Chain Pilot" } },
  { _id: "3", startupName: "FinFlow Solutions", startupId: "s3", status: "Rejected", appliedAt: "2023-10-15", opportunityId: { title: "Blockchain Payment Gateway" } },
  { _id: "4", startupName: "MediTech Wearables", startupId: "s4", status: "Pending", appliedAt: "2023-10-25", opportunityId: { title: "Remote Patient Monitoring" } },
  { _id: "5", startupName: "CyberShield", startupId: "s5", status: "Pending", appliedAt: "2023-10-26", opportunityId: { title: "Enterprise Zero Trust Security" } },
  { _id: "6", startupName: "AgriDrone", startupId: "s6", status: "Accepted", appliedAt: "2023-09-10", opportunityId: { title: "Automated Crop Analysis" } },
];

export default function CorporateDashboard() {
  const { user, logout } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", industry: "", budget: "", description: "" });
  
  // ✅ Initialize with Mock Data for demo purposes
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  
  const [applicantSearch, setApplicantSearch] = useState("");
  const [applicantFilter, setApplicantFilter] = useState("All");
  const [isExporting, setIsExporting] = useState(false);

  // Fake Analytics
  const chartData = [
    { name: 'Jan', applicants: 4 },
    { name: 'Feb', applicants: 7 },
    { name: 'Mar', applicants: 5 },
    { name: 'Apr', applicants: 12 },
    { name: 'May', applicants: 20 },
    { name: 'Jun', applicants: 18 },
  ];

  const stats = [
    { label: "Active Pilots", value: applicants.filter(a => a.status === 'Accepted').length, change: "Live Deals", color: "text-emerald-400" },
    { label: "Pending Reviews", value: applicants.filter(a => a.status === 'Pending').length, change: "Needs Attention", color: "text-yellow-400" },
    { label: "Total Budget", value: user.pilotBudget || "$500,000", change: "Allocated", color: "text-white" },
  ];

  useEffect(() => {
    // We are using MOCK data for now, but keeping the fetch function here for when backend is ready
    // fetchApplicants(); 
  }, []);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/api/applications/corporate", { headers: { "x-auth-token": token } });
      const data = await res.json();
      if(Array.isArray(data) && data.length > 0) setApplicants(data);
    } catch (e) { console.error(e); }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    // Optimistic UI Update (Updates immediately for demo feel)
    setApplicants(applicants.map(app => app._id === id ? { ...app, status: newStatus } : app));

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:5000/api/applications/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) { console.error(e); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    // Simulate post for demo
    alert("🚀 Innovation Challenge Live!");
    setShowPostModal(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
        setIsExporting(false);
        alert("📄 Report downloaded successfully!");
    }, 2000);
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.startupName?.toLowerCase().includes(applicantSearch.toLowerCase()) || 
                          app.opportunityId?.title.toLowerCase().includes(applicantSearch.toLowerCase());
    const matchesFilter = applicantFilter === "All" || app.status === applicantFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-300 font-sans flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#101116] border-r border-white/5 flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
           <div className="text-emerald-500 font-black text-2xl tracking-tighter">CONNECT<span className="text-white">CORP</span></div>
           <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Enterprise Solution</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <div className="text-xs font-bold text-slate-500 uppercase px-3 mb-2 mt-4">Main Menu</div>
           <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500">Dashboard Overview</button>
           <Link to="/profile" className="block w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-slate-400 hover:bg-white/5">Company Profile</Link>
           
           <div className="mt-8 px-4">
             <div className="bg-gradient-to-br from-emerald-900/50 to-black p-4 rounded-xl border border-emerald-500/20">
                <h4 className="text-emerald-400 font-bold text-xs mb-2">✨ Pro Tip</h4>
                <p className="text-[10px] text-slate-400">Review pending applications within 48 hours to increase match success rate.</p>
             </div>
           </div>
        </nav>
        <div className="p-4 border-t border-white/5">
           <div className="text-white font-bold text-sm mb-2">{user.companyName || "Tech Corp Global"}</div>
           <button onClick={logout} className="w-full py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded text-xs font-bold transition-colors">Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
           <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}}>
              <h1 className="text-3xl font-bold text-white mb-1">Innovation Command Center</h1>
              <p className="text-slate-400 text-sm">Real-time deal flow and pilot management.</p>
           </motion.div>
           
           <div className="flex gap-3">
             <motion.button 
                whileTap={{scale:0.95}} 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-[#1f2937] border border-white/10 hover:bg-white/5 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
             >
                {isExporting ? <span className="animate-spin">⏳</span> : "📄 Export Report"}
             </motion.button>

             <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => setShowPostModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-600/20 transition-all">
               + Post Challenge
             </motion.button>
           </div>
        </header>

        {/* STATS + CHART ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <div className="lg:col-span-1 space-y-6">
             {stats.map((stat, i) => (
                <motion.div 
                    initial={{opacity:0, y:20}} 
                    animate={{opacity:1, y:0}} 
                    transition={{delay: i * 0.1}} 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(21, 22, 27, 0.8)" }} 
                    key={i} 
                    className="bg-[#15161b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
                >
                   <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                   <div className="text-slate-500 text-xs font-bold uppercase mb-2">{stat.label}</div>
                   <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                   <div className="text-xs text-slate-400 mt-1">{stat.change}</div>
                </motion.div>
             ))}
           </div>

           <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.3}} className="lg:col-span-2 bg-[#15161b] p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold mb-6">Applicant Velocity (6 Months)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Area type="monotone" dataKey="applicants" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

        {/* APPLICANTS */}
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <h3 className="text-xl font-bold text-white">Inbound Proposals</h3>
              <div className="flex gap-2">
                 <input 
                    placeholder="Search startups..." 
                    className="bg-[#15161b] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                    value={applicantSearch}
                    onChange={(e) => setApplicantSearch(e.target.value)}
                 />
                 <select 
                    className="bg-[#15161b] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 outline-none"
                    value={applicantFilter}
                    onChange={(e) => setApplicantFilter(e.target.value)}
                 >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                 </select>
              </div>
           </div>

           <motion.div layout className="grid gap-4"> 
           <AnimatePresence>
           {filteredApplicants.length === 0 ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-[#15161b] p-10 rounded-2xl border border-dashed border-white/10 text-center text-slate-500">No active proposals match your filter.</motion.div>
           ) : (
              filteredApplicants.map((app) => (
                 <motion.div 
                    layout 
                    initial={{opacity:0, y:20}} 
                    animate={{opacity:1, y:0}} 
                    exit={{opacity:0, scale:0.95}}
                    key={app._id} 
                    className={`bg-[#15161b] p-6 rounded-2xl border transition-all ${app.status === 'Accepted' ? 'border-emerald-500/50 bg-emerald-900/5' : 'border-white/5'}`}
                 >
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="font-bold text-lg text-white">{app.startupName}</h4>
                          <div className="text-sm text-slate-400">Applied for: <span className="text-indigo-400">{app.opportunityId?.title}</span></div>
                          <div className="text-[10px] text-slate-600 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                       </div>
                       
                       {app.status === 'Pending' && <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full uppercase animate-pulse">Needs Review</span>}
                       {app.status === 'Accepted' && <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase">✓ Pilot Approved</span>}
                       {app.status === 'Rejected' && <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase">✕ Passed</span>}
                    </div>

                    {app.status === 'Pending' && (
                      <div className="mt-6 flex gap-3 border-t border-white/5 pt-4">
                          <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} className="flex-1 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded font-bold text-sm text-slate-300">Pass</button>
                          <button onClick={() => handleStatusUpdate(app._id, 'Accepted')} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-bold text-sm text-white">Approve Pilot</button>
                      </div>
                    )}
                    
                    {app.status === 'Accepted' && (
                      <div className="mt-4 border-t border-white/5 pt-4">
                          <Link 
                            to="/chat" 
                            state={{ partnerId: app.startupId, partnerName: app.startupName }}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold text-white text-sm transition-colors"
                          >
                            💬 Open Secure Chat
                          </Link>
                      </div>
                    )}
                 </motion.div>
              ))
           )}
           </AnimatePresence>
           </motion.div>
        </div>
      </main>

      {/* POST MODAL */}
      <AnimatePresence>
      {showPostModal && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/90 backdrop-blur z-[100] flex items-center justify-center p-4"
        >
           <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               exit={{ scale: 0.9, y: 20 }} 
               className="bg-[#15161b] w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl p-8"
           >
              <h2 className="text-xl font-bold text-white mb-6">Post Innovation Challenge</h2>
              <form onSubmit={handlePost} className="space-y-4">
                 <input placeholder="Title" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, title: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Industry" required className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, industry: e.target.value})} />
                    <input placeholder="Budget" required className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, budget: e.target.value})} />
                 </div>
                 <textarea placeholder="Description..." required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white h-32 focus:border-emerald-500 outline-none transition-colors" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setShowPostModal(false)} className="flex-1 bg-white/10 py-3 rounded-lg text-white font-bold hover:bg-white/20 transition-colors">Cancel</button>
                    <button className="flex-1 bg-emerald-600 py-3 rounded-lg text-white font-bold hover:bg-emerald-500 transition-colors">Launch</button>
                 </div>
              </form>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}