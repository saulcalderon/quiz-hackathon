"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <header 
      style={{
        position: "relative",
        paddingTop: "8rem",
        paddingBottom: "4rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        textAlign: "center",
        overflow: "hidden"
      }}
    >
      <div 
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1rem",
            textAlign: "center"
          }}
        >
          <span className="text-gradient">Tu conocimiento</span>
          <br />
          <span className="text-gradient">es tu divisa</span>
        </h1>

        {/* Description - CENTERED */}
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.1rem",
            marginBottom: "2rem",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            lineHeight: 1.6
          }}
        >
          Convierte tus PDFs de estudio en torneos gamificados. Acumula Skill Tokens, sube en el ranking y canjea recompensas. La IA es el árbitro.
        </p>

        {/* Buttons - CENTERED */}
        <div 
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "3rem",
            flexWrap: "wrap"
          }}
        >
          <a href="#" className="btn btn-primary">Crear Sala</a>
          <a href="#" className="btn btn-secondary">Cómo jugar</a>
        </div>

        {/* Demo Card with Gradient Border - CENTERED */}
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "3px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, var(--neon-green), var(--electric-purple), var(--holo-cyan))",
            backgroundSize: "200% 200%",
            animation: isLoaded ? "gradientBorder 3s ease infinite" : "none",
            transform: isLoaded ? "rotate(-2deg) translateY(0)" : "rotate(-2deg) translateY(30px)",
            opacity: isLoaded ? 1 : 0,
            transition: "all 0.6s ease-out 0.3s",
            boxShadow: "0 0 40px rgba(57, 255, 20, 0.2), 0 0 60px rgba(188, 19, 254, 0.15)",
          }}
        >
          <style jsx>{`
            @keyframes gradientBorder {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
          <div
            style={{
              background: "var(--bg-card)",
              padding: "20px",
              borderRadius: "17px",
              textAlign: "left"
            }}
          >
            {/* Card Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Anatomía I</span>
              <span style={{ color: "var(--token-gold)", fontWeight: "bold" }}>500 TOKENS 🪙</span>
            </div>

            {/* Progress Bar */}
            <div style={{ height: "10px", background: "var(--bg-progress)", borderRadius: "5px", marginBottom: "20px", overflow: "hidden" }}>
              <div style={{ 
                width: "70%", 
                height: "100%", 
                background: "linear-gradient(90deg, var(--neon-green), var(--holo-cyan))", 
                borderRadius: "5px" 
              }}></div>
            </div>

            {/* Question */}
            <h4 style={{ marginBottom: "10px", fontFamily: "var(--font-heading)", color: "white", textAlign: "center" }}>
              ¿Cuál es el hueso más largo?
            </h4>

            {/* Options */}
            <div style={{ display: "grid", gap: "10px" }}>
              {/* Option 1 */}
              <div style={{ 
                padding: "12px 16px", 
                border: "1px solid var(--text-muted)", 
                borderRadius: "8px", 
                fontSize: "0.9rem",
                color: "var(--text-body)",
                background: "transparent",
                textAlign: "center"
              }}>
                Tibia
              </div>
              
              {/* Option 2 (Selected) */}
              <div style={{ 
                padding: "12px 16px", 
                background: "var(--neon-green-subtle)", 
                border: "2px solid var(--neon-green)", 
                borderRadius: "8px", 
                fontSize: "0.9rem", 
                color: "var(--neon-green)",
                fontWeight: "500",
                textAlign: "center"
              }}>
                Fémur ✅
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
