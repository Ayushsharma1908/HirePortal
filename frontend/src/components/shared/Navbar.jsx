import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-ink-50/80 backdrop-blur-md border-b border-ink-100 shadow-soft"
          : "py-3 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-12" : "h-14"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-ink rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2"
                  y="6"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="white"
                  strokeWidth="1.4"
                />
                <path
                  d="M6 6V5a3 3 0 016 0v1"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-ink text-sm tracking-tight">
              HirePortal
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="#openings"
              className="hidden sm:inline-flex px-4 py-2 text-xs text-ink-400 hover:text-ink rounded-xl hover:bg-white/60 transition-all"
            >
              Openings
            </a>

           
            {/* <a
              href="#about"
              className="hidden sm:inline-flex px-4 py-2 text-xs text-ink-400 hover:text-ink rounded-xl hover:bg-white/60 transition-all"
            >
              About
            </a> */}
            {/* <Link
              to="/apply"
              className="px-4 py-2 text-xs font-medium text-ink border border-ink-200 rounded-2xl bg-white shadow-soft hover:border-ink hover:shadow-card transition-all"
            >
              Apply
            </Link> */}
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 border border-ink-200 text-ink px-4 py-2 text-xs rounded-2xl bg-white shadow-soft hover:bg-ink hover:text-white hover:border-ink hover:shadow-card transition-all duration-200"
            >
              <ShieldCheck size={12} />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
