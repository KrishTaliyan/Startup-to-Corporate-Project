import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { useLocation, Link } from "react-router-dom";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Get Partner details passed from Dashboard
  const partnerId = location.state?.partnerId;
  const partnerName = location.state?.partnerName || "Partner";

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch History
  useEffect(() => {
    if(!partnerId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/chat/${partnerId}`, {
           headers: { "x-auth-token": token }
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) { console.error(err); }
    };
    
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [partnerId, token]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if(!newMessage.trim()) return;

    await fetch("http://127.0.0.1:5000/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ receiverId: partnerId, text: newMessage })
    });

    setNewMessage("");
    // Refresh immediately
    const res = await fetch(`http://127.0.0.1:5000/api/chat/${partnerId}`, {
         headers: { "x-auth-token": token }
      });
    setMessages(await res.json());
  };

  if(!partnerId) return <div className="p-10 text-white bg-[#0B0C10] h-screen">Error: No user selected. <Link to="/dashboard" className="text-indigo-400 underline">Go back</Link></div>;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-[#15161b] border-b border-white/10 p-4 flex items-center gap-4 sticky top-0 z-50 shadow-xl">
        <Link to={user.role === 'startup' ? "/dashboard" : "/corporate"} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">← Back</Link>
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg">
            {partnerName[0]}
        </div>
        <div>
           <h2 className="font-bold text-lg leading-tight">{partnerName}</h2>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs text-slate-400 font-medium">Secure Line Active</span>
           </div>
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
         {messages.length === 0 && (
           <div className="text-center text-slate-500 mt-20">
             <div className="text-4xl mb-2">👋</div>
             <p>Start the conversation with {partnerName}.</p>
           </div>
         )}
         
         {messages.map((msg, index) => (
           <div key={index} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.senderId === user.id 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-[#1f2937] text-slate-200 border border-white/5 rounded-bl-none'
              }`}>
                 {msg.text}
                 <div className={`text-[10px] mt-2 opacity-50 font-bold ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
              </div>
           </div>
         ))}
         <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-[#15161b] border-t border-white/10">
         <form onSubmit={handleSend} className="flex gap-4 max-w-4xl mx-auto">
            <input 
              className="flex-1 bg-[#0B0C10] border border-white/10 rounded-full px-6 py-4 text-white focus:border-indigo-500 outline-none transition-colors"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/20 transition-all">
               Send
            </button>
         </form>
      </div>
    </div>
  );
}