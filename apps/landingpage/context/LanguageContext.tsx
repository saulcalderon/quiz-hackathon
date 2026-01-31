"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Hero
    "hero.title1": "YOUR KNOWLEDGE",
    "hero.title2": "IS YOUR CURRENCY",
    "hero.subtitle": "Turn your study PDFs into gamified tournaments. Earn tokens, climb the leaderboard, and redeem rewards.",
    "hero.login": "LOGIN",
    "hero.register": "REGISTER",
    "hero.question": "What is the longest bone?",
    
    // Ticker
    "ticker.won": "won",
    "ticker.in": "in",
    
    // StudyCycle
    "cycle.title": "HOW IT WORKS",
    "cycle.step1.title": "UPLOAD",
    "cycle.step1.desc": "Upload your notes (PDFs, documents). Our AI generates a validated quiz instantly.",
    "cycle.step2.title": "CHALLENGE",
    "cycle.step2.desc": "Create a room, set the entry fee in tokens, and invite your study group to compete.",
    "cycle.step3.title": "REWARDS",
    "cycle.step3.desc": "The top scorer takes the pot. Use tokens to redeem benefits or level up.",
    
    // AI Section
    "ai.badge": "POWERED BY AI",
    "ai.title": "FAIR PLAY GUARANTEED",
    "ai.desc": "Say goodbye to subjectivity. Our AI validates answers in real-time. No one has an unfair advantage—only the one who actually studied wins.",
    "ai.impartial": "IMPARTIAL",
    "ai.intelligent": "INTELLIGENT",
    "ai.secure": "SECURE",
    
    // Footer
    "footer.terms": "TERMS",
    "footer.rules": "RULES",
    "footer.disclaimer": "SkillStake is a gamified education platform. \"Tokens\" are virtual score units. The goal is to encourage consistent study habits.",
  },
  es: {
    // Hero
    "hero.title1": "TU CONOCIMIENTO",
    "hero.title2": "ES TU DIVISA",
    "hero.subtitle": "Convierte tus PDFs de estudio en torneos gamificados. Acumula tokens, sube en el ranking y canjea recompensas.",
    "hero.login": "INICIAR SESIÓN",
    "hero.register": "REGISTRARSE",
    "hero.question": "¿Cuál es el hueso más largo?",
    
    // Ticker
    "ticker.won": "ganó",
    "ticker.in": "en",
    
    // StudyCycle
    "cycle.title": "CÓMO FUNCIONA",
    "cycle.step1.title": "SUBIR",
    "cycle.step1.desc": "Sube tus apuntes (PDFs, notas). Nuestra IA genera un quiz validado al instante.",
    "cycle.step2.title": "DESAFIAR",
    "cycle.step2.desc": "Crea una sala, define la entrada en tokens e invita a tu grupo a competir.",
    "cycle.step3.title": "RECOMPENSAS",
    "cycle.step3.desc": "El que más sabe se lleva el pozo. Úsalos para canjear beneficios.",
    
    // AI Section
    "ai.badge": "IMPULSADO POR IA",
    "ai.title": "FAIR PLAY GARANTIZADO",
    "ai.desc": "Adiós a la subjetividad. Nuestra IA valida las respuestas en tiempo real. Nadie tiene ventaja, solo gana el que realmente estudió.",
    "ai.impartial": "IMPARCIAL",
    "ai.intelligent": "INTELIGENTE",
    "ai.secure": "SEGURO",
    
    // Footer
    "footer.terms": "TÉRMINOS",
    "footer.rules": "REGLAS",
    "footer.disclaimer": "SkillStake es una plataforma de educación gamificada. Los \"Tokens\" son unidades de puntaje virtual. El objetivo es incentivar el hábito de estudio.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
