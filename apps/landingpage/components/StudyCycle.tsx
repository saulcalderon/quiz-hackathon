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
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <h2 
          className="text-center mb-12"
          style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "2rem", 
            color: "var(--text-heading)" 
          }}
        >
          El Ciclo de Estudio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => {cardsRef.current[index] = el}}
              className="relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "2rem",
                borderRadius: "16px",
                opacity: visibleCards[index] ? 1 : 0,
                transform: visibleCards[index] ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.15}s`,
              }}
            >
              {/* Step Number - Background */}
              <span
                style={{
                  fontSize: "5rem",
                  fontWeight: 700,
                  color: "rgba(57, 255, 20, 0.08)",
                  position: "absolute",
                  top: "-15px",
                  right: "15px",
                  fontFamily: "var(--font-heading)",
                  lineHeight: 1,
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
