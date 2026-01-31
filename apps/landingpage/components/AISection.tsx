"use client";

export default function AISection() {
  return (
    /* CRITICAL: This section must be STRICTLY BELOW the feature cards with significant vertical gap */
    <section style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div className="container mx-auto px-6">
        {/* Single Wide Container for Fair Play Section */}
        <div
          style={{
            padding: "3px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, var(--neon-green), var(--electric-purple), var(--holo-cyan))",
            backgroundSize: "200% 200%",
            animation: "gradientBorder 4s ease infinite",
            maxWidth: "900px",
            margin: "0 auto"
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
            style={{
              background: "var(--bg-card)",
              borderRadius: "17px",
              padding: "3rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background Glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "var(--electric-purple)",
                filter: "blur(120px)",
                opacity: 0.1,
                pointerEvents: "none"
              }}
            />

            {/* AI Badge */}
            <span
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "50px",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "1.5rem",
                background: "var(--neon-green)",
                color: "var(--bg-main)",
                fontFamily: "var(--font-heading)",
                position: "relative",
                zIndex: 10
              }}
            >
              POWERED BY AI
            </span>

            {/* Title */}
            <h2
              style={{ 
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "var(--text-heading)",
                position: "relative",
                zIndex: 10
              }}
            >
              Fair Play Garantizado
            </h2>

            {/* Description */}
            <p
              style={{ 
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                maxWidth: "500px",
                margin: "0 auto 1.5rem",
                lineHeight: 1.6,
                position: "relative",
                zIndex: 10
              }}
            >
              Adiós a la subjetividad. Nuestra Inteligencia Artificial valida las
              respuestas en tiempo real. Nadie tiene ventaja, solo gana el que
              realmente estudió.
            </p>

            {/* Feature Badges/Icons */}
            <div 
              style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "2rem",
                position: "relative",
                zIndex: 10
              }}
            >
              {[
                { icon: "⚖️", label: "Imparcial" },
                { icon: "🤖", label: "Inteligente" },
                { icon: "🛡️", label: "Seguro" },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
