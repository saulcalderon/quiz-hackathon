"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar, Hero, Ticker, StudyCycle, AISection, Footer } from "@/components";

export default function Home() {
  return (
    <LanguageProvider>
      <div style={{ minHeight: "100vh", background: "var(--white)" }}>
        <Navbar />
        <main>
          <Hero />
          <Ticker />
          <StudyCycle />
          <AISection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
