"use client";

import { useEffect, useRef, useState } from "react";

interface CycleStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

const steps: CycleStep[] = [
  {
    number: "1",
    icon: "📤",
    title: "UPLOAD",
    description: "Sube tus apuntes (PDFs, notas). Nuestra IA genera un quiz validado al instante.",
  },
  {
    number: "2",
    icon: "⚡",
    title: "CHALLENGE",
    description: "Crea una sala, define la entrada en tokens e invita a tu grupo a competir.",
  },
  {
    number: "3",
    icon: "🏆",
    title: "REWARDS",
    description: "El que más sabe se lleva el pozo. Úsalos para canjear beneficios.",
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
    <section style={{ padding: "60px 40px", background: "var(--white)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Title */}
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "50px",
            textTransform: "uppercase",
            letterSpacing: "-1px"
          }}
        >
          CÓMO FUNCIONA
        </h2>

        {/* 3 Cards Grid */}
        <div
          className="study-cycle-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px"
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => { cardsRef.current[index] = el }}
              className="neo-box"
              style={{
                padding: "30px",
                position: "relative",
                opacity: visibleCards[index] ? 1 : 0,
                transform: visibleCards[index] ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.4s ease ${index * 0.1}s`
              }}
            >
              {/* Step Number Badge */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--purple)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                  marginBottom: "20px",
                  border: "3px solid var(--black)"
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>
                {step.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  marginBottom: "10px",
                  textTransform: "uppercase"
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p style={{ color: "var(--gray)", lineHeight: 1.6 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
