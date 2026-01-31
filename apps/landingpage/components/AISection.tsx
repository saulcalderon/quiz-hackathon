"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AISection() {
  const { t } = useLanguage();

  const features = [
    { icon: "⚖️", label: t("ai.impartial") },
    { icon: "🤖", label: t("ai.intelligent") },
    { icon: "🛡️", label: t("ai.secure") },
  ];

  return (
    <section style={{ padding: "60px 40px", background: "var(--white)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Main Card - Yellow Background */}
        <div
          className="neo-box"
          style={{
            background: "var(--yellow)",
            padding: "40px",
            textAlign: "center"
          }}
        >
          {/* AI Badge */}
          <span
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "var(--purple)",
              color: "white",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "20px",
              border: "3px solid var(--black)"
            }}
          >
            ⚡ {t("ai.badge")}
          </span>

          {/* Title */}
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              marginBottom: "15px",
              textTransform: "uppercase",
              letterSpacing: "-1px"
            }}
          >
            {t("ai.title")}
          </h2>

          {/* Description */}
          <p
            style={{
              color: "var(--black)",
              fontSize: "1.1rem",
              maxWidth: "500px",
              margin: "0 auto 25px",
              lineHeight: 1.6
            }}
          >
            {t("ai.desc")}
          </p>

          {/* Feature Icons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            {features.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "var(--white)",
                    border: "3px solid var(--black)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem"
                  }}
                >
                  {item.icon}
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.75rem" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
