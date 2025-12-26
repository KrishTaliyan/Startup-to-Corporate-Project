import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Import Auth Context

export default function Navbar() {
  const { user, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Added for mobile menu (optional)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    logout(); // Call the logout function from your context
    navigate("/"); // Redirect to home
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[72px] z-50 transition-all duration-300
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Changed Logo Icon to 'I' */}
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            I
          </div>
          {/* Changed text to InnoBridge */}
          <span className="text-xl font-extrabold text-gray-800 tracking-tight">
            Inno<span className="text-indigo-600">Bridge</span>
          </span>
        </Link>

        {/* MIDDLE NAV LINKS (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600 text-sm">
          <button onClick={() => scrollTo("hero")} className="hover:text-indigo-600 transition-colors">Home</button>
          <button onClick={() => scrollTo("features")} className="hover:text-indigo-600 transition-colors">Features</button>
          <button onClick={() => scrollTo("how")} className="hover:text-indigo-600 transition-colors">How it Works</button>
          
          {/* Only show these if User is NOT logged in */}
          {!user && (
             <button onClick={() => scrollTo("contact")} className="hover:text-indigo-600 transition-colors">Contact</button>
          )}
        </nav>

        {/* AUTH BUTTONS (Right Side) */}
        <div className="flex items-center gap-3">
          
          {user ? (
            // --- LOGGED IN VIEW ---
            <>
              {/* ADMIN BUTTON (Only for Admins) */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden md:block px-4 py-2 rounded-lg bg-red-50 text-red-600 font-bold text-sm border border-red-100 hover:bg-red-100 transition-all"
                >
                  Admin Panel
                </Link>
              )}

              {/* DASHBOARD LINK (Smart Redirect) */}
              <Link
                to={user.role === 'corporate' ? '/corporate' : '/dashboard'}
                className="px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            // --- GUEST VIEW ---
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}