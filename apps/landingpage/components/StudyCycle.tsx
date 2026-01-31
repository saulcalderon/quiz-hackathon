"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function StudyCycle() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  const steps = [
    {
      number: "1",
      icon: "📤",
      title: t("cycle.step1.title"),
      description: t("cycle.step1.desc"),
    },
    {
      number: "2",
      icon: "⚡",
      title: t("cycle.step2.title"),
      description: t("cycle.step2.desc"),
    },
    {
      number: "3",
      icon: "🏆",
      title: t("cycle.step3.title"),
      description: t("cycle.step3.desc"),
    },
  ];

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
          {t("cycle.title")}
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
