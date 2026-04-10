import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

/* ============================================================================
   1. ICON LIBRARY — Refined Stroke Icons + Socials
============================================================================ */
const Icons = {
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  ArrowUpRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>
  ),
  Zap: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6"/></svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Code: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  Cpu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg>
  ),
  Info: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  GitHub: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
  ),
};

/* ============================================================================
   2. MOCK DATA
============================================================================ */
const DATA = {
  mandates: [
    { id: 1, title: "Next-Gen Bio-Polymers", company: "EcoIndustries", budget: "$250k Pilot", tag: "Green Tech", time: "Just now", match: 98 },
    { id: 2, title: "Automated Workflow AI", company: "FinServe Global", budget: "$120k Pilot", tag: "AI/SaaS", time: "2h ago", match: 94 },
    { id: 3, title: "Supply Chain Ledger", company: "LogiCorp", budget: "$500k Scale", tag: "FinTech", time: "5h ago", match: 89 },
    { id: 4, title: "Carbon Capture Mesh", company: "AeroSpace Dynamics", budget: "$800k Pilot", tag: "Green Tech", time: "1d ago", match: 85 },
    { id: 5, title: "Neural Marketing Engine", company: "AdVantage", budget: "$90k Pilot", tag: "AI/SaaS", time: "2d ago", match: 82 },
    { id: 6, title: "Micro-Lending API", company: "Capital Nodes", budget: "$150k Seed", tag: "FinTech", time: "3d ago", match: 78 },
    { id: 7, title: "Quantum Key Distribution", company: "SecurVault", budget: "$1.2M Series A", tag: "Security", time: "4d ago", match: 99 },
    { id: 8, title: "Agri-Tech Soil Sensors", company: "FarmGlobal", budget: "$300k Pilot", tag: "Green Tech", time: "1w ago", match: 88 },
  ],
  faqs: [
    { q: "How does the synergy algorithm evaluate my MERN code?", a: "Our proprietary engine scans your GitHub repositories, analyzing React component architecture, Node.js API efficiency, and MongoDB schema design to generate a live Synergy Score against enterprise mandates." },
    { q: "Is the platform actually free for developers?", a: "Yes. We believe talent shouldn't pay a toll. Enterprises pay the licensing and pilot integration fees. You keep 100% of your contract value." },
    { q: "What happens when I hit a 90%+ match?", a: "The system automatically drafts a secure NDA and schedules a direct video bridge with the enterprise decision-maker, completely bypassing standard HR filters." },
    { q: "Can I use this for non-MERN stacks?", a: "Currently, our deepest integration is built for the MERN/PERN ecosystem, but we are rolling out support for Python/Django and Go architectures next quarter." },
  ],
};

/* ============================================================================
   3. GOOGLE FONT LOADER
============================================================================ */
const FontLoader = () => {
  useEffect(() => {
    if (!document.getElementById("innobridge-fonts")) {
      const link = document.createElement("link");
      link.id = "innobridge-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);
  return null;
};

/* ============================================================================
   4. REUSABLE SUB-COMPONENTS
============================================================================ */

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.92 }}
      className="fixed bottom-8 right-8 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl"
      style={{
        background: type === "success" ? "#FFFFFF" : "#FEF2F2",
        color: type === "success" ? "#065F46" : "#991B1B",
        fontFamily: "Outfit, sans-serif",
        border: type === "success" ? "1.5px solid #10B981" : "1.5px solid #EF4444",
      }}
    >
      <div
        className="w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center"
        style={{ background: type === "success" ? "#D1FAE5" : "#FEE2E2" }}
      >
        {type === "success" ? <Icons.Check className="w-4 h-4" /> : <Icons.Info className="w-4 h-4" />}
      </div>
      <p className="text-sm font-bold tracking-wide">{message}</p>
    </motion.div>
  );
};

const CountUp = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const dur = 2200;
    const inc = end / (dur / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Marquee = ({ items, speed = 30 }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-12 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-sm font-bold tracking-widest uppercase opacity-40"
            style={{ fontFamily: "Outfit, sans-serif", color: "#0F172A" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const MatchRing = ({ value }) => {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 90 ? "#10B981" : value >= 80 ? "#F59E0B" : "#0EA5E9";

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#F1F5F9" strokeWidth="3" />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 24 24)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x="24"
        y="26"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill={color}
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        {value}
      </text>
    </svg>
  );
};

/* ============================================================================
   5. CSS-IN-JS STYLES — Subtly Pink-Tinted Light Theme
============================================================================ */
const GlobalStyles = () => {
  useEffect(() => {
    if (document.getElementById("innobridge-global")) return;
    const style = document.createElement("style");
    style.id = "innobridge-global";
    style.textContent = `
      :root {
        --cream:  #FFFCFD; /* Very slight pinkish white */
        --linen:  #FFF5F7; /* Slightly warmer pinkish-grey */
        --sand:   #F1E8EC; /* Warm sand with a hint of rose */
        --clay:   #64748B;
        --coffee: #475569;
        --ink:    #0F172A; 
        --accent: #0EA5E9; 
        --accent2:#10B981; 
        --accent-soft:#E0F2FE;
        --accent2-soft:#D1FAE5;
        --rose:   #F43F5E;
        --rose-soft:#FFE4E6;
        --font-display: 'DM Serif Display', Georgia, serif;
        --font-body: 'Outfit', system-ui, sans-serif;
      }

      .ib-body {
        background: var(--cream);
        font-family: var(--font-body);
        color: var(--ink);
      }

      html { scroll-behavior: smooth; }
      section { scroll-margin-top: 100px; }

      .ib-body ::selection {
        background: var(--rose-soft);
        color: var(--rose);
      }

      .ib-grain::after {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 100;
        opacity: 0.018; 
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 180px;
      }

      .ib-card {
        transition: transform 0.45s cubic-bezier(.22,1,.36,1),
                    box-shadow 0.45s cubic-bezier(.22,1,.36,1);
      }
      .ib-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 24px 50px -12px rgba(15, 23, 42, 0.06);
      }

      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .ib-shimmer {
        background-size: 200% auto;
        animation: shimmer 3s linear infinite;
      }

      .ib-body::-webkit-scrollbar { width: 6px; }
      .ib-body::-webkit-scrollbar-track { background: var(--cream); }
      .ib-body::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 99px; }

      .ib-link { position: relative; }
      .ib-link::after {
        content: "";
        position: absolute;
        left: 0; bottom: -2px;
        width: 0; height: 1.5px;
        background: var(--accent);
        transition: width 0.35s cubic-bezier(.22,1,.36,1);
      }
      .ib-link:hover::after { width: 100%; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  return null;
};

/* ============================================================================
   6. MAIN APPLICATION COMPONENT
============================================================================ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activeFaq, setActiveFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const triggerToast = useCallback((msg) => {
    setToastMessage(null);
    setTimeout(() => setToastMessage(msg), 60);
  }, []);

  const filters = ["All", "AI/SaaS", "FinTech", "Green Tech", "Security"];
  const filteredDeals = DATA.mandates.filter((d) => {
    const fMatch = activeFilter === "All" || d.tag === activeFilter;
    const sMatch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.company.toLowerCase().includes(searchQuery.toLowerCase());
    return fMatch && sMatch;
  });

  const tagColor = (tag) => {
    switch (tag) {
      case "AI/SaaS": return { bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE" };
      case "FinTech": return { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" };
      case "Green Tech": return { bg: "#D1FAE5", text: "#047857", border: "#A7F3D0" };
      case "Security": return { bg: "#FFE4E6", text: "#BE123C", border: "#FECDD3" };
      default: return { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };
    }
  };

  const marqueeWords = [
    "Innovation", "Enterprise", "Synergy", "MERN Optimized", "Neural Audit",
    "Smart Connect", "Deal Flow", "Startup Capital", "Scale Up", "Legal Sandbox",
    "Verified Partners", "Global Network", "Pilot Ready",
  ];

  return (
    <>
      <FontLoader />
      <GlobalStyles />

      <div className="ib-body ib-grain min-h-screen overflow-x-hidden relative">
        {/* CLEAN BACKGROUND WITH PINK SHADE */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, var(--sand) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Light, fresh gradients + the requested pink shade */}
          <div className="absolute top-1/4 -left-32 w-[800px] h-[800px] rounded-full" style={{ background: "radial-gradient(circle, rgba(244, 63, 94, 0.05) 0%, transparent 60%)" }} />
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)" }} />
        </div>

        {/* NAVBAR */}
        <nav
          className="fixed top-0 w-full z-50 transition-all duration-500"
          style={{
            background: scrolled ? "rgba(255, 252, 253, 0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid var(--sand)" : "1px solid transparent",
            padding: scrolled ? "14px 0" : "28px 0",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform bg-[var(--accent)]">I</div>
              <span className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
                INNO<span style={{ fontWeight: 400, color: "var(--clay)" }}>BRIDGE</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1 px-2 py-2 rounded-full bg-white shadow-sm border border-[var(--sand)]">
              {[
                { label: "Architecture", href: "#architecture" },
                { label: "Pipeline", href: "#pipeline" },
                { label: "Metrics", href: "#stats" },
                { label: "Pricing", href: "#pricing" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="ib-link px-5 py-2.5 text-sm font-bold rounded-full transition-colors hover:bg-[var(--linen)] text-[var(--ink)]">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 relative z-50">
              {/* FIXED ROUTING */}
              <Link to="/login" className="hidden sm:block text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:bg-[var(--sand)] text-[var(--ink)]">
                Sign In
              </Link>
              <Link to="/register" className="text-white text-sm font-bold px-7 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all bg-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>
                Get Started
              </Link>
              <button className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button">
                <span className="w-5 h-0.5 rounded-full bg-[var(--ink)]" />
                <span className="w-4 h-0.5 rounded-full bg-[var(--ink)]" />
                <span className="w-5 h-0.5 rounded-full bg-[var(--ink)]" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden bg-[var(--cream)] border-t border-[var(--sand)]">
                <div className="px-6 py-6 flex flex-col gap-4">
                  {["Architecture", "Pipeline", "Metrics", "Pricing"].map((l) => (
                    <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-2 text-[var(--ink)]">{l}</a>
                  ))}
                  {/* FIXED ROUTING */}
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-2 text-[var(--ink)]">Sign In</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO SECTION */}
        <section ref={heroRef} className="relative z-10 pt-44 pb-32 px-6">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 bg-white border border-[var(--sand)] shadow-sm" style={{ fontFamily: "var(--font-body)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-sky-500" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--ink)]">
                  Verified Founder Portal &middot; Active Session
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[1.08] mb-8 tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                Where Breakthroughs
                <br />
                Meet{" "}
                <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Enterprise Capital.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12 text-[var(--coffee)] font-[400]" style={{ fontFamily: "var(--font-body)" }}>
                Bypass the gatekeepers. Broadcast your vision directly to Fortune&nbsp;500
                leaders and secure your next strategic pilot.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* FIXED ROUTING */}
                <Link to="/register" className="h-14 px-9 rounded-full text-white font-bold flex items-center justify-center gap-2.5 text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all ib-shimmer" style={{ backgroundImage: "linear-gradient(135deg, var(--accent), var(--accent2), var(--accent))", backgroundSize: "200% auto", fontFamily: "var(--font-body)" }}>
                  Broadcast Vision
                  <Icons.ArrowUpRight className="w-5 h-5" />
                </Link>
                <button type="button" onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })} className="h-14 px-9 rounded-full font-bold flex items-center justify-center text-base transition-all active:scale-95 cursor-pointer hover:bg-[var(--linen)] bg-white shadow-sm border border-[var(--sand)] text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>
                  Explore Pipeline
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-16 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-[var(--clay)]">
                {["SOC 2 Certified", "480+ Enterprise Partners", "$2.4B Deal Flow", "12h Avg. Approval"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <Icons.Check className="w-3.5 h-3.5 text-[var(--accent2)]" />
                    {badge}
                  </div>
                ))}
              </div>
            </Reveal>
          </motion.div>
        </section>

        {/* MARQUEE */}
        <div className="py-6 border-y bg-white border-[var(--sand)]">
          <Marquee items={marqueeWords} speed={35} />
        </div>

        {/* STATS */}
        <section id="stats" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-10 md:p-14 rounded-3xl bg-white border border-[var(--sand)] shadow-sm">
                {[
                  { prefix: "$", end: 2, suffix: ".4B", label: "Deal Flow Processed" },
                  { prefix: "", end: 480, suffix: "+", label: "Enterprise Partners" },
                  { prefix: "", end: 94, suffix: "%", label: "Average Match Rate" },
                  { prefix: "", end: 12, suffix: "h", label: "Pilot Approval Time" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl md:text-5xl font-black mb-2 text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                      <CountUp prefix={s.prefix} end={s.end} suffix={s.suffix} />
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--clay)]">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section id="architecture" className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-20">
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[var(--accent)]">Platform Architecture</p>
                <h2 className="text-4xl md:text-5xl tracking-tight mb-6 text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                  Built for <span className="italic text-[var(--accent)]">Engineers.</span>
                </h2>
                <p className="text-lg max-w-2xl mx-auto text-[var(--coffee)]">
                  We eliminated warm intros, cold emails, and gatekeepers. Just visionary ideas and verified capital.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Neural Code Audit", desc: "Our AI scans tech stacks and GitHub commits instantly to verify startup maturity and technical depth.", icon: <Icons.Code className="w-7 h-7" />, accent: "var(--accent)", soft: "var(--accent-soft)", number: "01" },
                { title: "Smart Connect", desc: "Directly bridge the gap between startup solutions and specific corporate pain points with intelligent matching.", icon: <Icons.Zap className="w-7 h-7" />, accent: "var(--accent2)", soft: "var(--accent2-soft)", number: "02" },
                { title: "Legal Automator", desc: "Pre-executed legal frameworks reduce pilot onboarding time by up to 80%, accelerating your go-to-market.", icon: <Icons.Shield className="w-7 h-7" />, accent: "var(--rose)", soft: "var(--rose-soft)", number: "03" },
              ].map((feat, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="ib-card p-10 rounded-3xl h-full flex flex-col cursor-pointer group bg-white border border-[var(--sand)] shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-white group-hover:shadow-sm" style={{ background: feat.soft, color: feat.accent }}>
                        {feat.icon}
                      </div>
                      <span className="text-4xl font-black text-[var(--sand)]" style={{ fontFamily: "var(--font-display)" }}>{feat.number}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[var(--ink)]">{feat.title}</h3>
                    <p className="text-sm leading-relaxed flex-grow text-[var(--coffee)]">{feat.desc}</p>
                    <button onClick={() => triggerToast(`Loading details for ${feat.title}...`)} className="mt-8 flex items-center gap-2 text-sm font-bold text-left transition-all" style={{ color: feat.accent }}>
                      Learn more <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section id="pipeline" className="py-28 px-6 bg-[var(--linen)] border-y border-[var(--sand)]">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-14 gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-[var(--accent)]">Live Marketplace</p>
                  <h2 className="text-4xl md:text-5xl tracking-tight mb-3 text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>Active Pipeline</h2>
                  <p className="text-base text-[var(--coffee)]">Real-time sourcing mandates from global enterprise partners.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full lg:w-auto">
                  <div className="relative w-full md:w-64 shadow-sm rounded-xl">
                    <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--clay)]" />
                    <input type="text" placeholder="Search mandates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all bg-white border border-[var(--sand)] text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }} onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--sand)")} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                      <button key={f} type="button" onClick={() => setActiveFilter(f)} className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm" style={{ background: activeFilter === f ? "var(--ink)" : "#FFFFFF", color: activeFilter === f ? "#FFFFFF" : "var(--coffee)", border: activeFilter === f ? "1px solid var(--ink)" : "1px solid var(--sand)" }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnimatePresence>
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => {
                    const tc = tagColor(deal.tag);
                    return (
                      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} key={deal.id} onClick={() => triggerToast(`Connecting to ${deal.company}...`)} className="ib-card p-7 rounded-2xl flex flex-col cursor-pointer group bg-white border border-[var(--sand)] shadow-sm">
                        <div className="flex justify-between items-start mb-5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>{deal.tag}</span>
                          <span className="text-[10px] font-bold text-[var(--clay)]">{deal.time}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 leading-snug group-hover:text-[var(--accent)] transition-colors text-[var(--ink)]">{deal.title}</h3>
                        <p className="text-xs font-medium mb-6 flex-grow text-[var(--clay)]">{deal.company}</p>
                        <div className="flex items-center justify-between pt-5 border-t border-[var(--sand)]">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] block mb-1 text-[var(--clay)]">Allocation</span>
                            <span className="text-base font-black text-[var(--ink)]">{deal.budget}</span>
                          </div>
                          <MatchRing value={deal.match} />
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-xl font-bold mb-3 text-[var(--clay)]">No mandates found matching criteria.</p>
                    <button type="button" onClick={() => { setActiveFilter("All"); setSearchQuery(""); }} className="font-bold hover:underline cursor-pointer text-[var(--accent)]">Clear Filters</button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[var(--accent)]">Transparent Pricing</p>
                <h2 className="text-4xl md:text-5xl tracking-tight mb-8 text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                  Simple Architecture
                </h2>
                
                {/* TOGGLE SWITCH */}
                <div className="inline-flex items-center p-1 rounded-full bg-[var(--sand)] shadow-inner">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className="px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                    style={{
                      background: billingCycle === "monthly" ? "#FFFFFF" : "transparent",
                      color: billingCycle === "monthly" ? "var(--ink)" : "var(--coffee)",
                      boxShadow: billingCycle === "monthly" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annually")}
                    className="px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: billingCycle === "annually" ? "#FFFFFF" : "transparent",
                      color: billingCycle === "annually" ? "var(--ink)" : "var(--coffee)",
                      boxShadow: billingCycle === "annually" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    }}
                  >
                    Annually
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--accent2-soft)] text-[var(--accent2)] border border-[#A7F3D0]">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <Reveal delay={0}>
                <div className="ib-card p-10 rounded-3xl h-full flex flex-col bg-white border border-[var(--sand)] shadow-sm hover:shadow-md">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4 text-[var(--coffee)]">Developers / Startups</p>
                  <div className="mb-10 text-center md:text-left">
                    <span className="text-6xl font-black text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>$0</span>
                    <span className="text-base font-bold ml-2 text-[var(--clay)]">/forever</span>
                  </div>
                  <ul className="space-y-5 mb-10 flex-grow">
                    {["Full MERN Stack Support", "Portfolio Integration", "Direct Pitch Access"].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm font-bold text-[var(--ink)]">
                        <div className="w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--accent-soft)]">
                          <Icons.Check className="w-3 h-3 text-[var(--accent)]" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {/* FIXED ROUTING */}
                  <div className="text-center">
                    <Link
                      to="/register"
                      className="inline-block px-8 py-3 w-fit mx-auto rounded-xl text-center font-bold text-sm transition-all duration-200 active:scale-95 hover:-translate-y-0.5 bg-white border border-[var(--sand)] text-[var(--ink)] hover:bg-slate-50 shadow-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Create Profile
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Enterprise Tier */}
              <Reveal delay={0.1}>
                <div className="ib-card p-10 rounded-3xl h-full flex flex-col relative overflow-hidden bg-white border-2 border-[var(--accent)] shadow-[0_8px_30px_-12px_rgba(14,165,233,0.2)] hover:shadow-[0_12px_40px_-12px_rgba(14,165,233,0.3)]">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--accent-soft)] blur-[60px] opacity-60 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>Enterprise Partners</p>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[#BAE6FD]">Popular</span>
                    </div>
                    <div className="mb-10 text-center md:text-left">
                      <span className="text-6xl font-black text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                        ${billingCycle === "monthly" ? "4,999" : "3,999"}
                      </span>
                      <span className="text-base font-bold ml-2 text-[var(--clay)]">/mo</span>
                    </div>
                    <ul className="space-y-5 mb-10 flex-grow">
                      {["Dedicated Node Support", "AI Verification Audit", "Private Sandbox Network"].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm font-bold text-[var(--ink)]">
                          <div className="w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--accent-soft)]">
                            <Icons.Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {/* FIXED ROUTING */}
                    <div className="text-center">
                      <Link
                        to="/register"
                        className="inline-block px-8 py-3 w-fit mx-auto rounded-xl text-center font-bold text-white text-sm transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-[var(--accent)] hover:bg-sky-600"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Initialize Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 px-6 bg-[var(--linen)] border-y border-[var(--sand)]">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[var(--accent)]">Support</p>
                <h2 className="text-4xl md:text-5xl tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>System Queries</h2>
              </div>
            </Reveal>

            <div className="space-y-3">
              {DATA.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div
                    className="rounded-2xl overflow-hidden transition-all bg-white"
                    style={{ border: `1px solid ${activeFaq === i ? "var(--accent)" : "var(--sand)"}`, boxShadow: activeFaq === i ? "0 4px 20px -10px rgba(14,165,233,0.15)" : "none" }}
                  >
                    <button type="button" onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full px-7 py-5 flex justify-between items-center text-left cursor-pointer transition-all hover:bg-[var(--linen)]">
                      <span className="font-bold text-base pr-4 text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>{faq.q}</span>
                      <Icons.ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform duration-300" style={{ color: activeFaq === i ? "var(--accent)" : "var(--clay)", transform: activeFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                          <div className="px-7 pb-6 text-sm leading-relaxed text-[var(--coffee)]">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 px-6">
          <Reveal>
            <div className="max-w-5xl mx-auto py-16 px-10 md:px-20 rounded-3xl text-center relative overflow-hidden bg-white border border-[var(--sand)] shadow-lg">
              <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23E2E8F0\\' fill-opacity=\\'1\\'/%3E%3C/svg%3E')]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl text-[var(--ink)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Ready to bridge the gap?
                </h2>
                <p className="text-base md:text-lg mb-10 max-w-xl mx-auto font-medium text-[var(--coffee)]">
                  Join 480+ enterprise partners and thousands of innovative startups already transforming their industries.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {/* FIXED ROUTING */}
                  <Link to="/register" className="h-14 px-9 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all bg-[var(--ink)] text-white">
                    Get Started Free
                    <Icons.ArrowRight className="w-4 h-4" />
                  </Link>
                  <button type="button" onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })} className="h-14 px-9 rounded-full text-base font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer bg-white text-[var(--ink)] border border-[var(--sand)] hover:bg-[var(--linen)]">
                    View Pipeline
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FOOTER - EXACTLY AS YOU REQUESTED */}
        <footer className="pt-24 pb-10 px-6 bg-[var(--cream)] border-t border-[var(--sand)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg bg-[var(--accent)]">I</div>
                  <span className="text-xl font-black tracking-tight text-[var(--ink)]">INNOBRIDGE <span className="font-[400] text-[var(--clay)]">GLOBAL</span></span>
                </div>
                <p className="max-w-sm text-sm font-medium leading-relaxed text-[var(--coffee)] mb-6">
                  Redefining the industrial revolution through data-backed synergy. MERN optimized. Built for scale.
                </p>
                <div className="flex items-center gap-4">
                  <a  href="https://github.com/KrishTaliyan" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[var(--sand)] text-[var(--clay)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:-translate-y-1 transition-all shadow-sm">
                    <Icons.GitHub className="w-5 h-5" />
                  </a>
                  
                  <a href="https://www.linkedin.com/in/krish-taliyan/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[var(--sand)] text-[var(--clay)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:-translate-y-1 transition-all shadow-sm">
                    <Icons.LinkedIn className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="col-span-1" />

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5 text-[var(--ink)]">Architecture</h4>
                <ul className="space-y-3 text-sm font-bold text-[var(--coffee)]">
                  <li className="cursor-pointer hover:text-[var(--accent)] transition-colors" onClick={() => triggerToast("Loading Synergy Logic...")}>Synergy Algorithm</li>
                  <li className="cursor-pointer hover:text-[var(--accent)] transition-colors" onClick={() => triggerToast("Loading Live Marketplace...")}>Live Marketplace</li>
                  <li className="cursor-pointer hover:text-[var(--accent)] transition-colors" onClick={() => triggerToast("Loading Sandbox Environment...")}>Legal Sandbox</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5 text-[var(--ink)]">Protocol</h4>
                <ul className="space-y-3 text-sm font-bold text-[var(--coffee)]">
                  <li className="cursor-pointer hover:text-[var(--accent)] transition-colors">Security Audit</li>
                  <li className="cursor-pointer hover:text-[var(--accent)] transition-colors">Terms of Service</li>
                  <li className="cursor-pointer hover:text-[var(--accent)] transition-colors">Privacy Framework</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[var(--sand)]">
              <pre className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--clay)]">&copy; 2026 INNOBRIDGE GLOBAL. Compiled Successfully.<br></br>
              </pre>
              <p>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] border ">Krish Taliyan</span>
                
              </p>
              <p>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] border ">Sanju sri</span>
                
              </p>
              
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        </AnimatePresence>
      </div>
    </>
  );
}