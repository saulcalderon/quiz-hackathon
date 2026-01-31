"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Language = "en" | "es";

const months = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
};

const content: Record<Language, {
  title: string;
  back: string;
  lastUpdated: string;
  sections: Array<{
    title: string;
    content: string;
    list?: string[];
  }>;
}> = {
  en: {
    title: "TERMS & CONDITIONS",
    back: "← BACK",
    lastUpdated: "Last updated:",
    sections: [
      {
        title: "1. ACCEPTANCE OF TERMS",
        content: "By accessing and using StakeStudy, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."
      },
      {
        title: "2. DESCRIPTION OF SERVICE",
        content: "StakeStudy is a gamified education platform that allows users to:",
        list: [
          "Upload study materials for AI-generated quizzes",
          "Compete in knowledge-based tournaments",
          "Earn and redeem virtual tokens",
          "Track learning progress and statistics"
        ]
      },
      {
        title: "3. VIRTUAL TOKENS",
        content: "Important: StakeStudy tokens are virtual score units used exclusively within the platform for educational gamification purposes. They:",
        list: [
          "Have no real-world monetary value",
          "Cannot be exchanged for fiat currency",
          "Are non-transferable outside the platform",
          "May only be used to redeem in-platform benefits"
        ]
      },
      {
        title: "4. USER CONDUCT",
        content: "Users agree not to:",
        list: [
          "Use automated systems or bots",
          "Share account credentials",
          "Upload copyrighted material without authorization",
          "Attempt to manipulate quiz results",
          "Engage in any form of cheating"
        ]
      },
      {
        title: "5. FAIR PLAY POLICY",
        content: "Our AI-powered validation system monitors all quiz sessions for fairness. Any detected violations may result in:",
        list: [
          "Forfeiture of tokens earned",
          "Temporary or permanent account suspension",
          "Exclusion from tournaments"
        ]
      },
      {
        title: "6. PRIVACY",
        content: "We collect and process user data in accordance with our Privacy Policy. Uploaded study materials are processed by AI for quiz generation and are not shared with third parties."
      },
      {
        title: "7. MODIFICATIONS",
        content: "StakeStudy reserves the right to modify these terms at any time. Users will be notified of significant changes via email or in-app notification."
      }
    ]
  },
  es: {
    title: "TÉRMINOS Y CONDICIONES",
    back: "← VOLVER",
    lastUpdated: "Última actualización:",
    sections: [
      {
        title: "1. ACEPTACIÓN DE TÉRMINOS",
        content: "Al acceder y usar StakeStudy, aceptas y te comprometes a cumplir con los términos y disposiciones de este acuerdo. Si no estás de acuerdo con estos términos, por favor no uses este servicio."
      },
      {
        title: "2. DESCRIPCIÓN DEL SERVICIO",
        content: "StakeStudy es una plataforma de educación gamificada que permite a los usuarios:",
        list: [
          "Subir materiales de estudio para quizzes generados por IA",
          "Competir en torneos basados en conocimiento",
          "Ganar y canjear tokens virtuales",
          "Seguir el progreso de aprendizaje y estadísticas"
        ]
      },
      {
        title: "3. TOKENS VIRTUALES",
        content: "Importante: Los tokens de StakeStudy son unidades de puntaje virtual usadas exclusivamente dentro de la plataforma para propósitos de gamificación educativa. Ellos:",
        list: [
          "No tienen valor monetario real",
          "No pueden ser intercambiados por dinero fiduciario",
          "No son transferibles fuera de la plataforma",
          "Solo pueden usarse para canjear beneficios dentro de la plataforma"
        ]
      },
      {
        title: "4. CONDUCTA DEL USUARIO",
        content: "Los usuarios acuerdan no:",
        list: [
          "Usar sistemas automatizados o bots",
          "Compartir credenciales de cuenta",
          "Subir material con copyright sin autorización",
          "Intentar manipular resultados de quizzes",
          "Participar en cualquier forma de trampa"
        ]
      },
      {
        title: "5. POLÍTICA DE JUEGO LIMPIO",
        content: "Nuestro sistema de validación impulsado por IA monitorea todas las sesiones de quiz por equidad. Cualquier violación detectada puede resultar en:",
        list: [
          "Pérdida de tokens ganados",
          "Suspensión temporal o permanente de la cuenta",
          "Exclusión de torneos"
        ]
      },
      {
        title: "6. PRIVACIDAD",
        content: "Recopilamos y procesamos datos de usuarios de acuerdo con nuestra Política de Privacidad. Los materiales de estudio subidos son procesados por IA para generación de quizzes y no se comparten con terceros."
      },
      {
        title: "7. MODIFICACIONES",
        content: "StakeStudy se reserva el derecho de modificar estos términos en cualquier momento. Los usuarios serán notificados de cambios significativos por correo electrónico o notificación en la app."
      }
    ]
  }
};

export default function TermsPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [currentDate, setCurrentDate] = useState("");
  const t = content[language];

  useEffect(() => {
    const now = new Date();
    const month = months[language][now.getMonth()];
    const year = now.getFullYear();
    setCurrentDate(`${month} ${year}`);
  }, [language]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "3px solid var(--black)",
          background: "var(--white)"
        }}
      >
        <Link 
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.5rem",
            fontWeight: 900,
            letterSpacing: "-1px",
            cursor: "pointer",
            textDecoration: "none",
            color: "var(--black)"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "var(--yellow)",
              border: "3px solid var(--black)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "0.8rem"
            }}
          >
            SS
          </div>
          STAKESTUDY
        </Link>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {/* Language Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span 
              style={{ 
                fontWeight: language === "en" ? 900 : 400,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
              onClick={() => setLanguage("en")}
            >
              EN
            </span>
            <div
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              style={{
                width: "50px",
                height: "26px",
                background: language === "en" ? "var(--purple)" : "var(--green)",
                border: "3px solid var(--black)",
                cursor: "pointer",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "var(--white)",
                  border: "2px solid var(--black)",
                  position: "absolute",
                  top: "2px",
                  left: language === "en" ? "4px" : "26px",
                  transition: "left 0.3s ease"
                }}
              />
            </div>
            <span 
              style={{ 
                fontWeight: language === "es" ? 900 : 400,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
              onClick={() => setLanguage("es")}
            >
              ES
            </span>
          </div>

          <Link 
            href="/"
            className="btn btn-secondary"
            style={{ textDecoration: "none" }}
          >
            {t.back}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 40px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 900,
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "-1px"
          }}
        >
          {t.title}
        </h1>

        <div style={{ lineHeight: 1.8, color: "var(--black)" }}>
          {t.sections.map((section, index) => (
            <section key={index} style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  marginBottom: "15px",
                  textTransform: "uppercase"
                }}
              >
                {section.title}
              </h2>
              <p style={{ marginBottom: "15px" }}>{section.content}</p>
              {section.list && (
                <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                  {section.list.map((item, i) => (
                    <li key={i} style={{ marginBottom: "10px" }}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div
            className="neo-box"
            style={{
              background: "var(--yellow)",
              padding: "20px",
              marginTop: "40px"
            }}
          >
            <p style={{ fontWeight: 700, textAlign: "center" }}>
              {t.lastUpdated} {currentDate}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "20px 40px",
          borderTop: "3px solid var(--black)",
          background: "var(--white)",
          textAlign: "center"
        }}
      >
        <p style={{ color: "var(--gray)", fontSize: "0.75rem" }}>
          © 2024 STAKESTUDY PROJECT
        </p>
      </footer>
    </div>
  );
}
