"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
      style={{
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div
                className="w-7 h-7 rotate-45 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "var(--bg-card)",
                  border: "2px solid var(--neon-green)",
                  boxShadow: "0 0 12px var(--neon-green-glow)",
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 transition-all duration-300"
                  style={{ background: "var(--electric-purple)" }}
                />
              </div>
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stake<span style={{ color: "var(--neon-green)" }}>Study</span>
            </span>
          </div>

          {/* Connect Wallet Button */}
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg"
            style={{
              background: "transparent",
              border: "1px solid var(--holo-cyan)",
              color: "var(--holo-cyan)",
              fontFamily: "var(--font-heading)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            Conectar Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
