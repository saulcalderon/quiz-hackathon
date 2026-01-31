"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

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

      {/* Language Switch */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span 
          style={{ 
            fontWeight: language === "en" ? 900 : 400,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onClick={() => setLanguage("en")}
        >
          EN
        </span>
        
        {/* Toggle Switch */}
        <div
          onClick={toggleLanguage}
          style={{
            width: "60px",
            height: "30px",
            background: language === "en" ? "var(--purple)" : "var(--green)",
            border: "3px solid var(--black)",
            borderRadius: "0",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.3s ease"
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              background: "var(--white)",
              border: "2px solid var(--black)",
              position: "absolute",
              top: "2px",
              left: language === "en" ? "4px" : "32px",
              transition: "left 0.3s ease"
            }}
          />
        </div>
        
        <span 
          style={{ 
            fontWeight: language === "es" ? 900 : 400,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onClick={() => setLanguage("es")}
        >
          ES
        </span>
      </div>
    </header>
  );
}
