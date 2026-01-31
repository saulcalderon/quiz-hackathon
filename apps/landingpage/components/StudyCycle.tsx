"use client";

import { useEffect, useRef, useState } from "react";

interface CycleStep {
  number: string;
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
}

const steps: CycleStep[] = [
  {
    number: "01",
    icon: "☁️",
    title: "Upload",
    description:
      "Sube tus apuntes (PDFs, notas). Nuestra IA genera un quiz validado al instante para desafiar tu memoria.",
  },
  {
    number: "02",
    icon: "⚡",
    iconColor: "var(--neon-green)",
    title: "Challenge",
    description:
      "Crea una sala y define la entrada en Skill Tokens. Invita a tu grupo de estudio a competir.",
  },
  {
    number: "03",
    icon: "🎁",
    title: "Rewards",
    description:
      "El que más sabe se lleva el pozo de Tokens. Úsalos para canjear beneficios o subir de nivel en la plataforma.",
  },
];

export default function StudyCycle() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleCards((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <h2 
          style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "2rem", 
            color: "var(--text-heading)",
            textAlign: "center",
            marginBottom: "3rem"
          }}
        >
          El Ciclo de Estudio
        </h2>
        
        {/* 3 Cards Grid - Wide Gutters */}
        <div 
          className="study-cycle-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem", /* Wide gutters between cards */
            maxWidth: "1100px",
            margin: "0 auto"
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => {cardsRef.current[index] = el}}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "2rem",
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                opacity: visibleCards[index] ? 1 : 0,
                transform: visibleCards[index] ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.15}s`,
              }}
              className="hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Step Number - Large Background Number */}
              <span
                style={{
                  fontSize: "5rem",
                  fontWeight: 700,
                  color: "rgba(57, 255, 20, 0.1)",
                  position: "absolute",
                  top: "-10px",
                  right: "15px",
                  fontFamily: "var(--font-heading)",
                  lineHeight: 1,
                  pointerEvents: "none"
                }}
              >
                {step.number}
              </span>

              {/* Icon */}
              <span
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  display: "block",
                  color: step.iconColor || "inherit"
                }}
              >
                {step.icon}
              </span>

              {/* Title */}
              <h3
                style={{
                  marginBottom: "0.75rem",
                  fontSize: "1.4rem",
                  fontFamily: "var(--font-heading)",
                  color: "var(--text-heading)"
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6
                }}
              >
                {step.number === "02" ? (
                  <>
                    Crea una sala y define la entrada en{" "}
                    <strong style={{ color: "var(--neon-green)" }}>Skill Tokens</strong>. 
                    Invita a tu grupo de estudio a competir.
                  </>
                ) : (
                  step.description
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
