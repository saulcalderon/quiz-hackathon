"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      style={{
        padding: "60px 40px",
        textAlign: "center",
        background: "var(--white)"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 900,
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "-2px",
            lineHeight: 1.1
          }}
        >
          {t("hero.title1")}
          <br />
          <span style={{ color: "var(--purple)" }}>{t("hero.title2")}</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "var(--gray)",
            fontSize: "1.1rem",
            marginBottom: "30px",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          {t("hero.subtitle")}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginBottom: "50px",
            flexWrap: "wrap"
          }}
        >
          <button className="btn btn-primary">
            {t("hero.createRoom")} →
          </button>
          <button className="btn btn-secondary">
            {t("hero.howToPlay")}
          </button>
        </div>

        {/* Demo Card - Neo Brutalist Style */}
        <div
          className="neo-box"
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            padding: "25px",
            textAlign: "left",
            transform: isLoaded ? "rotate(-2deg)" : "rotate(-2deg) translateY(20px)",
            opacity: isLoaded ? 1 : 0,
            transition: "all 0.5s ease"
          }}
        >
          {/* Card Header */}
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "20px",
              alignItems: "center"
            }}
          >
            <span 
              style={{ 
                background: "var(--purple)",
                color: "white",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "2px solid var(--black)"
              }}
            >
              ANATOMY I
            </span>
            <span style={{ fontWeight: 900 }}>500 TOKENS 🪙</span>
          </div>

          {/* Progress Bar */}
          <div 
            style={{ 
              height: "12px", 
              background: "#eee", 
              border: "2px solid var(--black)",
              marginBottom: "20px"
            }}
          >
            <div 
              style={{ 
                width: "70%", 
                height: "100%", 
                background: "var(--green)"
              }}
            />
          </div>

          {/* Question */}
          <h4 
            style={{ 
              marginBottom: "15px", 
              fontWeight: 700,
              fontSize: "1.1rem"
            }}
          >
            {t("hero.question")}
          </h4>

          {/* Options */}
          <div style={{ display: "grid", gap: "10px" }}>
            <div
              style={{
                padding: "12px 16px",
                border: "3px solid var(--black)",
                fontWeight: 600,
                cursor: "pointer",
                background: "var(--white)"
              }}
            >
              Tibia
            </div>
            <div
              style={{
                padding: "12px 16px",
                border: "3px solid var(--black)",
                fontWeight: 700,
                cursor: "pointer",
                background: "var(--green)"
              }}
            >
              Femur ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
