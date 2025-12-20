import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[72px] z-40 transition-all
        ${scrolled ? "bg-white/80 backdrop-blur shadow" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between pointer-events-auto">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="text-xl font-extrabold text-gray-800">
            Connect<span className="text-indigo-600">X</span>
          </span>
        </Link>

        {/* LINKS */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-gray-700">
          <button onClick={() => scrollTo("hero")} className="hover:text-indigo-600">
            Home
          </button>
          <button onClick={() => scrollTo("features")} className="hover:text-indigo-600">
            Features
          </button>
          <button onClick={() => scrollTo("how")} className="hover:text-indigo-600">
            How it works
          </button>
          <button onClick={() => scrollTo("help")} className="hover:text-indigo-600">
            Help
          </button>
          <button onClick={() => scrollTo("contact")} className="hover:text-indigo-600">
            Contact
          </button>
        </nav>

        {/* AUTH */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
