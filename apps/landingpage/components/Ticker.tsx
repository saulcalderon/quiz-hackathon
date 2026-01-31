"use client";

import { useEffect, useRef } from "react";

interface Winner {
  user: string;
  amount: number;
  subject: string;
}

const winners: Winner[] = [
  { user: "AlexDev", amount: 50, subject: "Java" },
  { user: "SarahMed", amount: 120, subject: "Anatomía" },
  { user: "LawMaster", amount: 85, subject: "Derecho Civil" },
  { user: "CryptoKid", amount: 200, subject: "Economía" },
  { user: "EngineerX", amount: 45, subject: "Física II" },
];

function TickerContent() {
  return (
    <>
      {winners.map((winner, index) => (
        <div
          key={index}
          className="inline-block px-8 shrink-0"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text-body)",
            fontSize: "0.9rem",
          }}
        >
          🔥 {winner.user} ganó <span style={{ color: "var(--token-gold)", fontWeight: "bold" }}>{winner.amount} Tokens</span> en {winner.subject}
        </div>
      ))}
    </>
  );
}

export default function Ticker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      position -= speed;
      const contentWidth = container.scrollWidth / 4; 
      if (Math.abs(position) >= contentWidth) {
        position = 0;
      }
      container.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    // HTML STYLE: background-color: var(--bg-card); border-top: 1px solid var(--neon-green); border-bottom: 1px solid var(--neon-green); padding: 10px 0; margin: 2rem 0;
    <div
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        borderTop: "1px solid var(--neon-green)",
        borderBottom: "1px solid var(--neon-green)",
        padding: "10px 0",
        margin: "2rem 0",
      }}
    >
      <div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        <TickerContent />
        <TickerContent />
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
}
