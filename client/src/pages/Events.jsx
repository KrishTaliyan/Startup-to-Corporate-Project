import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "", link: "", description: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/events", { headers: { "x-auth-token": token } });
    setEvents(await res.json());
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    fetchEvents();
  };

  const handleRSVP = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/api/events/rsvp/${id}`, { method: "PUT", headers: { "x-auth-token": token } });
    if (res.ok) {
        alert("✅ RSVP Confirmed! See you there.");
        fetchEvents();
    } else {
        alert("⚠️ You are already registered.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white font-sans">
      <nav className="p-6 border-b border-white/10 flex justify-between items-center bg-[#15161b]">
        <div className="text-xl font-bold">Virtual<span className="text-purple-500">DemoDays</span></div>
        <Link to={user.role === 'startup' ? "/dashboard" : "/corporate"} className="text-sm font-bold text-slate-400 hover:text-white">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-end mb-10">
           <div>
              <h1 className="text-4xl font-bold mb-2">Upcoming Live Events</h1>
              <p className="text-slate-400">Pitch nights, webinars, and investor roundtables.</p>
           </div>
           {user.role === 'corporate' && (
              <button onClick={() => setShowModal(true)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-600/20">
                 + Host Event
              </button>
           )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {events.map(event => (
              <div key={event._id} className="bg-[#1f2937] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all group">
                 <div className="h-32 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 flex items-end">
                    <div className="bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString()}</div>
                 </div>
                 <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{event.title}</h3>
                    <div className="text-sm font-bold text-slate-400 mb-4">Hosted by: {event.organizerName}</div>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{event.description}</p>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                       <div className="text-xs text-slate-500">{event.attendees.length} Attendees</div>
                       {event.attendees.includes(user.id) ? (
                          <span className="text-green-400 font-bold text-sm">✓ Registered</span>
                       ) : (
                          <button onClick={() => handleRSVP(event._id)} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-500 hover:text-white transition-all">
                             RSVP Now
                          </button>
                       )}
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showModal && (
         <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="bg-[#15161b] w-full max-w-lg rounded-2xl border border-white/10 p-8">
               <h2 className="text-2xl font-bold mb-6">Host a New Event</h2>
               <form onSubmit={handleCreate} className="space-y-4">
                  <input placeholder="Event Title" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" onChange={e => setFormData({...formData, date: e.target.value})} />
                  <input placeholder="Zoom/Meet Link" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" onChange={e => setFormData({...formData, link: e.target.value})} />
                  <textarea placeholder="Description" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white h-24" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/10 py-3 rounded-lg font-bold">Cancel</button>
                     <button className="flex-1 bg-purple-600 py-3 rounded-lg font-bold">Publish Event</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}