"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <header className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
      {/* Background Effects (kept minimal/subtle as per original feel if desired, or just standard gradient text) */}
      <div className="container mx-auto relative z-10">
        
        {/* Title */}
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            lineHeight: 1.1,
          }}
        >
          <span className="text-gradient">Tu conocimiento</span>
          <br />
          <span className="text-gradient">es tu divisa</span>
        </h1>

        {/* Description */}
        <p
          className="text-lg mb-8 max-w-xl mx-auto"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Convierte tus PDFs de estudio en torneos gamificados. Acumula Skill Tokens, sube en el ranking y canjea recompensas. La IA es el árbitro.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a href="#" className="btn btn-primary">Crear Sala</a>
          <a href="#" className="btn btn-secondary">Cómo jugar</a>
        </div>

        {/* Demo Card with Gradient Border */}
        <div
          className="max-w-[380px] mx-auto text-left relative"
          style={{
            marginTop: "3rem",
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
            <h4 style={{ marginBottom: "10px", fontFamily: "var(--font-heading)", color: "white" }}>
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
                background: "transparent"
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
                fontWeight: "500"
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
