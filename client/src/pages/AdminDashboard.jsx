import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- ICONS ---
const Icons = {
  Grid: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  TrendUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
};

// --- MOCK DATA GENERATOR ---
const generatePremiumData = () => {
  const tiers = [
    { name: "Google", domain: "google.com", ind: "Tech", rev: 15000 },
    { name: "Amazon", domain: "amazon.com", ind: "Cloud", rev: 12000 },
    { name: "Tesla", domain: "tesla.com", ind: "Auto", rev: 9500 },
    { name: "Netflix", domain: "netflix.com", ind: "Media", rev: 8000 },
    { name: "Stripe", domain: "stripe.com", ind: "FinTech", rev: 11000 }
  ];
  return Array.from({ length: 50 }).map((_, i) => {
    const isBigTech = i < 5;
    const tier = isBigTech ? tiers[i] : null;
    return {
      _id: `u_${i + 100}`,
      companyName: isBigTech ? tier.name : `Startup ${i + 1} Inc.`,
      email: isBigTech ? `admin@${tier.domain}` : `founder@startup${i + 1}.io`,
      role: isBigTech ? "corporate" : (i % 4 === 0 ? "corporate" : "startup"),
      industry: isBigTech ? tier.ind : ["SaaS", "AI", "Health", "FinTech"][i % 4],
      revenue: isBigTech ? tier.rev : (i % 4 === 0 ? 5000 : 499),
      status: i % 15 === 0 ? "inactive" : "active",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString()
    };
  });
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ startups: 0, corporates: 0, total: 0, mrr: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'users' | 'settings'
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFeed, setActivityFeed] = useState([]);
  const [greeting, setGreeting] = useState("Welcome back");

  // Settings State
  const [config, setConfig] = useState({
      maintenanceMode: false,
      allowSignups: true,
      emailNotifications: true,
      adminName: "Super Admin",
      adminEmail: "admin@connectx.com"
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    fetchUsers();
    const interval = setInterval(() => addRandomActivity(), 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Slight delay for effect
        const token = localStorage.getItem("token");
        let realData = [];
        try {
            const res = await fetch("http://127.0.0.1:5000/api/admin/users", { headers: { "x-auth-token": token } });
            if (res.ok) realData = await res.json();
        } catch (e) {}

        const mockData = generatePremiumData();
        const combined = [...realData, ...mockData];
        setUsers(combined);
        calculateStats(combined);
        setLoading(false);
    } catch (e) { setLoading(false); }
  };

  const calculateStats = (data) => {
      const startups = data.filter(u => u.role === "startup").length;
      const corporates = data.filter(u => u.role === "corporate").length;
      const mrr = data.reduce((acc, curr) => acc + (curr.revenue || (curr.role === 'corporate' ? 5000 : 299)), 45000); 
      setStats({ startups, corporates, total: data.length, mrr });
  };

  const addRandomActivity = () => {
      const msgs = [
          { t: "New Enterprise Contract Signed", v: "+$12,000", i: "💰" },
          { t: "Startup Pro Subscription", v: "+$499", i: "🚀" },
          { t: "User Login: San Francisco, US", v: "Active", i: "🌍" },
          { t: "Database Backup Completed", v: "System", i: "🛡️" },
          { t: "New Match: FinTech Sector", v: "Success", i: "🤝" }
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setActivityFeed(prev => [{ id: Date.now(), ...msg }, ...prev].slice(0, 6));
  };

  const handleDelete = (id) => {
      if(!window.confirm("Permanently remove this entity?")) return;
      const updated = users.filter(u => u._id !== id);
      setUsers(updated);
      calculateStats(updated);
  };

  const handleSaveSettings = () => {
      setSavingSettings(true);
      setTimeout(() => {
          setSavingSettings(false);
          alert("Configuration Saved Successfully!");
      }, 1500);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.companyName && user.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px]"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin z-10"></div>
          <div className="mt-4 text-indigo-400 font-mono text-sm tracking-widest animate-pulse z-10">ESTABLISHING SECURE CONNECTION...</div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex overflow-hidden selection:bg-indigo-500/30">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="w-20 lg:w-72 bg-[#09090b]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">C</div>
          <div className="ml-4 hidden lg:block">
              <div className="font-bold text-white tracking-tight text-lg">Connect<span className="text-indigo-500">X</span></div>
              <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Admin Console</div>
          </div>
        </div>
        
        <nav className="flex-1 py-8 space-y-2 px-4">
          <SidebarItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Icons.Grid />} label="Dashboard" />
          <SidebarItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Icons.Users />} label="User Management" />
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider hidden lg:block">System</div>
          <SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Icons.Settings />} label="Platform Settings" />
        </nav>

        <div className="p-6 border-t border-white/5">
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-white/5 hidden lg:block">
                <div className="text-xs text-indigo-300 font-bold mb-1">Server Status</div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    OPERATIONAL
                </div>
            </div>
            <Link to="/" className="mt-4 flex items-center gap-3 text-slate-400 hover:text-white transition-colors px-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span className="hidden lg:block text-sm font-medium">Sign Out</span>
            </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* TOP BAR */}
        <header className="h-24 bg-[#09090b]/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-8 shrink-0">
           <div>
               <h1 className="text-2xl font-bold text-white">{greeting}, Admin</h1>
               <p className="text-slate-500 text-sm">Here is today's platform overview</p>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="relative hidden md:block group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
               <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#050505] border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/50 block w-80 pl-10 p-2.5 outline-none transition-all" placeholder="Search users, companies, logs..." />
             </div>
             <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-black"></span>
                <Icons.Bell />
             </button>
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px]">
                 <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">AD</div>
             </div>
           </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Monthly Revenue" value={`$${stats.mrr.toLocaleString()}`} trend="+24.5%" trendUp={true} />
                    <StatCard label="Total Users" value={stats.total} trend="+12 this week" trendUp={true} />
                    <StatCard label="Startups" value={stats.startups} trend="+5.2%" trendUp={true} />
                    <StatCard label="Churn Rate" value="1.2%" trend="-0.4%" trendUp={false} isGood={true} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-[#0a0a0c] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-white font-bold text-lg">Revenue Growth</h3>
                                <p className="text-slate-500 text-xs">Financial performance over time</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400">+128% YoY</span>
                        </div>
                        <div className="h-72 w-full"><SmoothLineChart /></div>
                    </div>
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 z-10">
                            <h3 className="text-white font-bold text-lg">Live Activity</h3>
                            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span></div>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/10 to-transparent"></div>
                            {activityFeed.map((item) => (
                                <div key={item.id} className="flex gap-4 relative animate-in slide-in-from-right-8 fade-in duration-500">
                                    <div className="w-10 h-10 rounded-full bg-[#151518] border border-white/10 flex items-center justify-center text-lg z-10 shadow-lg">{item.i}</div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-start"><p className="text-sm font-medium text-slate-200">{item.t}</p><span className="text-[10px] text-slate-500 font-mono">Just now</span></div>
                                        <p className="text-xs text-indigo-400 mt-0.5 font-bold">{item.v}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none z-20"></div>
                    </div>
                </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold text-white text-lg">Database Records</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2"><Icons.Check /> Add User</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <th className="p-5 pl-8">Company</th>
                                <th className="p-5">Plan</th>
                                <th className="p-5">MRR</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.slice(0, 50).map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-inner ${user.role === 'corporate' ? 'bg-blue-600' : 'bg-emerald-600'}`}>{(user.companyName || "U")[0].toUpperCase()}</div>
                                            <div><div className="font-bold text-white text-sm">{user.companyName || "Unknown"}</div><div className="text-xs text-slate-500 font-mono">{user.email}</div></div>
                                        </div>
                                    </td>
                                    <td className="p-5"><span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${user.role === 'corporate' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>{user.role}</span></td>
                                    <td className="p-5"><div className="text-sm text-slate-300 font-mono font-medium">${(user.revenue || (user.role === 'corporate' ? 5000 : 299)).toLocaleString()}<span className="text-slate-600 text-[10px] ml-1">/mo</span></div></td>
                                    <td className="p-5"><div className={`flex items-center gap-2 text-xs font-bold ${user.status === 'inactive' ? 'text-slate-500' : 'text-emerald-400'}`}><div className={`w-1.5 h-1.5 rounded-full ${user.status === 'inactive' ? 'bg-slate-500' : 'bg-emerald-400 shadow-[0_0_8px_currentColor]'}`}></div>{user.status === 'inactive' ? 'Inactive' : 'Active'}</div></td>
                                    <td className="p-5 text-right pr-8"><button onClick={() => handleDelete(user._id)} className="text-slate-600 hover:text-red-400 transition-colors p-2 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100"><Icons.Trash /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* SETTINGS TAB (New Functionality) */}
          {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold text-white">Platform Configuration</h2>
                      <button 
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {savingSettings ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Icons.Save />}
                          {savingSettings ? "Saving..." : "Save Changes"}
                      </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Section 1: Admin Profile */}
                      <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-2xl">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Icons.Shield /> Admin Profile</h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                                  <input 
                                    type="text" 
                                    value={config.adminName} 
                                    onChange={(e) => setConfig({...config, adminName: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admin Email</label>
                                  <input 
                                    type="email" 
                                    value={config.adminEmail} 
                                    onChange={(e) => setConfig({...config, adminEmail: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Section 2: System Toggles */}
                      <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-2xl">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Icons.Settings /> System Controls</h3>
                          <div className="space-y-6">
                              <ToggleSwitch 
                                label="Maintenance Mode" 
                                desc="Disable access for non-admin users" 
                                active={config.maintenanceMode} 
                                onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})} 
                              />
                              <ToggleSwitch 
                                label="Allow New Signups" 
                                desc="Users can register new accounts" 
                                active={config.allowSignups} 
                                onClick={() => setConfig({...config, allowSignups: !config.allowSignups})} 
                              />
                              <ToggleSwitch 
                                label="Email Notifications" 
                                desc="Send system alerts via email" 
                                active={config.emailNotifications} 
                                onClick={() => setConfig({...config, emailNotifications: !config.emailNotifications})} 
                              />
                          </div>
                      </div>

                      {/* Section 3: Danger Zone */}
                      <div className="md:col-span-2 bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
                          <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                          <p className="text-slate-400 text-sm mb-4">Irreversible actions. Please proceed with caution.</p>
                          <div className="flex gap-4">
                              <button className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 rounded-lg text-sm font-bold transition-all">Purge System Cache</button>
                              <button className="px-4 py-2 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-white/10 rounded-lg text-sm font-bold transition-all">Reset Analytics Data</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          <div className="text-center text-slate-700 text-[10px] font-mono uppercase tracking-widest mt-12 pb-4">
             ConnectX Secured Admin Protocol • v3.4.0
          </div>
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTS ---

function SidebarItem({ icon, label, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{icon}</span>
            <span className="font-medium text-sm hidden lg:block">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full hidden lg:block shadow-[0_0_6px_white]"></div>}
        </button>
    );
}

function StatCard({ label, value, trend, trendUp, isGood }) {
    const isPositive = isGood ? !trendUp : trendUp;
    return (
        <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
                <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'} bg-white/5 px-2 py-1 rounded-md`}>
                    <Icons.TrendUp />{trend}
                </div>
            </div>
        </div>
    );
}

function ToggleSwitch({ label, desc, active, onClick }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="text-sm font-bold text-white">{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
            </div>
            <button 
                onClick={onClick}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
}

// Smooth Chart Logic
function SmoothLineChart() {
    const points = [10, 40, 30, 70, 60, 110, 95, 140, 130, 170, 160, 210];
    const width = 1000;
    const height = 300;
    const spacing = width / (points.length - 1);
    const pathData = points.map((p, i) => `${i * spacing},${height - p}`).join(" ");
    const fillData = `${pathData} ${width},${height} 0,${height}`;

    return (
        <div className="w-full h-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {[0, 1, 2, 3].map(i => (<line key={i} x1="0" y1={i * (height/3)} x2={width} y2={i * (height/3)} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />))}
                <path d={`M ${fillData} Z`} fill="url(#chartFill)" />
                <polyline points={pathData} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
                    <animate attributeName="stroke-dasharray" from={`0, ${width * 2}`} to={`${width * 2}, 0`} dur="1.5s" fill="freeze" />
                </polyline>
            </svg>
        </div>
    );
}