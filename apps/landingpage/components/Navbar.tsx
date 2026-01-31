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
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "3px solid var(--black)",
        background: "var(--white)",
        position: scrolled ? "fixed" : "relative",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease"
      }}
    >
      {/* Logo */}
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "1.5rem",
          fontWeight: 900,
          letterSpacing: "-1px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "var(--yellow)",
            border: "3px solid var(--black)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "0.8rem"
          }}
        >
          SS
        </div>
        SKILLSTAKE
      </div>

      {/* Nav Actions */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          className="neo-box"
          style={{
            padding: "8px 16px",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.9rem",
            cursor: "pointer",
            background: "var(--purple)",
            color: "white",
            border: "3px solid var(--black)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ★ 0 XP
        </button>
        <button
          className="neo-box"
          style={{
            padding: "8px 16px",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.9rem",
            cursor: "pointer",
            background: "var(--yellow)",
            color: "var(--black)",
            border: "3px solid var(--black)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ⚇ 0
        </button>
        <button
          className="neo-box"
          style={{
            padding: "8px 16px",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.9rem",
            cursor: "pointer",
            background: "var(--green)",
            color: "var(--black)",
            border: "3px solid var(--black)"
          }}
        >
          + TOP UP
        </button>
      </div>
    </header>
  );
}
