import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/posts", { headers: { "x-auth-token": token } });
      const data = await res.json();
      setPosts(data);
    } catch (err) { console.error(err); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if(!newPost.trim()) return;
    
    await fetch("http://127.0.0.1:5000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ text: newPost })
    });
    setNewPost("");
    fetchPosts(); // Refresh list
  };

  const handleLike = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/posts/like/${id}`, { method: "PUT", headers: { "x-auth-token": token } });
    fetchPosts(); // Refresh list to show new like count
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-300 font-sans">
      {/* NAVBAR */}
      <nav className="p-6 border-b border-white/10 flex justify-between items-center bg-[#15161b] sticky top-0 z-50">
        <div className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="text-2xl">🌍</span> Global<span className="text-blue-500">Feed</span>
        </div>
        <Link to={user.role === 'startup' ? "/dashboard" : "/corporate"} className="text-sm font-bold text-slate-400 hover:text-white">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto p-8">
        
        {/* CREATE POST BOX */}
        <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/10 mb-8 shadow-xl">
           <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg">
                 {user.companyName ? user.companyName[0] : "U"}
              </div>
              <form onSubmit={handlePost} className="flex-1">
                 <textarea 
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-24 resize-none"
                    placeholder="Share a milestone, update, or ask a question..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                 ></textarea>
                 <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-500 font-bold">Posting as {user.companyName}</span>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20">Post Update</button>
                 </div>
              </form>
           </div>
        </div>

        {/* POSTS FEED */}
        <div className="space-y-6">
           {posts.length === 0 ? (
             <div className="text-center text-slate-500 py-10">No posts yet. Be the first to share something!</div>
           ) : (
             posts.map(post => (
                <div key={post._id} className="bg-[#15161b] p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all shadow-lg">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                         <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                            {post.authorCompany ? post.authorCompany[0] : "U"}
                         </div>
                         <div>
                            <div className="font-bold text-white text-lg leading-tight">{post.authorCompany}</div>
                            <div className="text-xs text-slate-500">{post.authorName} • {new Date(post.createdAt).toLocaleDateString()}</div>
                         </div>
                      </div>
                   </div>
                   
                   <p className="text-slate-300 leading-relaxed mb-6 text-base">{post.text}</p>
                   
                   <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                      <button 
                         onClick={() => handleLike(post._id)}
                         className={`flex items-center gap-2 text-sm font-bold transition-all ${post.likes.includes(user.id) ? 'text-red-500' : 'text-slate-500 hover:text-white'}`}
                      >
                         <span className="text-lg">{post.likes.includes(user.id) ? '❤️' : '🤍'}</span> 
                         {post.likes.length} Likes
                      </button>
                      <button className="text-slate-500 hover:text-white text-sm font-bold flex items-center gap-2">
                         <span>💬</span> Comment
                      </button>
                   </div>
                </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}