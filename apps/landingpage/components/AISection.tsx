"use client";

export default function AISection() {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        {/* Card with Gradient Border */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: "2px",
            background: "linear-gradient(135deg, var(--neon-green), var(--electric-purple), var(--holo-cyan))",
            backgroundSize: "200% 200%",
            animation: "gradientBorder 4s ease infinite",
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
            className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden"
            style={{
              background: "var(--bg-card)",
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background: "var(--electric-purple)",
                filter: "blur(120px)",
                opacity: 0.1,
              }}
            />

            {/* AI Badge */}
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-5 relative z-10"
              style={{
                background: "var(--neon-green)",
                color: "var(--bg-main)",
                fontFamily: "var(--font-heading)",
              }}
            >
              POWERED BY AI
            </span>

            {/* Title */}
            <h2
              className="text-2xl md:text-3xl font-bold mb-4 relative z-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Fair Play Garantizado
            </h2>

            {/* Description */}
            <p
              className="text-sm md:text-base max-w-xl mx-auto mb-6 relative z-10"
              style={{ color: "var(--text-muted)" }}
            >
              Adiós a la subjetividad. Nuestra Inteligencia Artificial valida las
              respuestas en tiempo real. Nadie tiene ventaja, solo gana el que
              realmente estudió.
            </p>

            {/* Feature Icons */}
            <div className="flex justify-center gap-8 relative z-10">
              {[
                { icon: "⚖️", label: "Imparcial" },
                { icon: "🤖", label: "Inteligente" },
                { icon: "🛡️", label: "Seguro" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">{item.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
