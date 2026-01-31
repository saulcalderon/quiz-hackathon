"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Winner {
  id: number;
  user: string;
  amount: number;
  subject: string;
}

const winners: Winner[] = [
  { id: 1, user: "AlexDev", amount: 50, subject: "Java" },
  { id: 2, user: "SarahMed", amount: 120, subject: "Anatomy" },
  { id: 3, user: "LawMaster", amount: 85, subject: "Civil Law" },
  { id: 4, user: "CryptoKid", amount: 200, subject: "Economics" },
  { id: 5, user: "EngineerX", amount: 45, subject: "Physics II" },
];

export default function Ticker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState(20);
  const { t } = useLanguage();

  useEffect(() => {
    if (tickerRef.current) {
      const width = tickerRef.current.scrollWidth;
      setAnimationDuration(width / 50);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "var(--yellow)",
        borderTop: "3px solid var(--black)",
        borderBottom: "3px solid var(--black)",
        padding: "12px 0"
      }}
    >
      <div
        ref={tickerRef}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: `scroll ${animationDuration}s linear infinite`
        }}
      >
        {[...winners, ...winners, ...winners].map((winner, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              padding: "0 2rem",
              fontWeight: 700,
              color: "var(--black)",
              fontSize: "0.9rem",
              textTransform: "uppercase"
            }}
          >
            🔥 {winner.user} {t("ticker.won")} <strong>{winner.amount} TOKENS</strong> {t("ticker.in")} {winner.subject}
          </span>
        ))}
      </div>
    </div>
  );
}
