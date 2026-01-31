"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        padding: "30px 40px",
        borderTop: "3px solid var(--black)",
        background: "var(--white)",
        textAlign: "center"
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            background: "var(--yellow)",
            border: "2px solid var(--black)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "0.6rem"
          }}
        >
          SS
        </div>
        <span style={{ fontWeight: 900, fontSize: "1.1rem" }}>
          SKILLSTAKE
        </span>
      </div>

      {/* Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "20px"
        }}
      >
        <a
          href="#"
          style={{
            color: "var(--black)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          {t("footer.terms")}
        </a>
        <a
          href="#"
          style={{
            color: "var(--black)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          {t("footer.rules")}
        </a>
      </div>

      {/* Disclaimer */}
      <p
        style={{
          color: "var(--gray)",
          fontSize: "0.75rem",
          maxWidth: "500px",
          margin: "0 auto 15px",
          lineHeight: 1.5
        }}
      >
        {t("footer.disclaimer")}
      </p>

      {/* Copyright */}
      <p style={{ color: "var(--gray)", fontSize: "0.75rem" }}>
        © 2024 SKILLSTAKE PROJECT
      </p>
    </footer>
  );
}
