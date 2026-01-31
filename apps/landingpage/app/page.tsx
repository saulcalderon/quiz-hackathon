import { Navbar, Hero, Ticker, StudyCycle, AISection, Footer } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Background Glow Effects */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "var(--electric-purple)",
          filter: "blur(200px)",
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Ticker />
        <StudyCycle />
        <AISection />
      </main>
      <Footer />
    </div>
  );
}
