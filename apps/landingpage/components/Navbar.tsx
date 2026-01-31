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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(10, 14, 23, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div 
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem 1.5rem"
        }}
      >
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Logo */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer"
            }}
          >
            {/* Diamond Icon - Fixed overflow */}
            <div 
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  transform: "rotate(45deg)",
                  transition: "all 0.3s ease",
                  background: "var(--bg-card)",
                  border: "2px solid var(--neon-green)",
                  boxShadow: "0 0 12px var(--neon-green-glow)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "8px",
                    height: "8px",
                    background: "var(--electric-purple)"
                  }}
                />
              </div>
            </div>
            <span
              style={{ 
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.025em"
              }}
            >
              Stake<span style={{ color: "var(--neon-green)" }}>Study</span>
            </span>
          </div>

          {/* Connect Wallet Button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.25rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "all 0.3s ease",
              background: "transparent",
              border: "1px solid var(--holo-cyan)",
              color: "var(--holo-cyan)",
              fontFamily: "var(--font-heading)",
              cursor: "pointer"
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
