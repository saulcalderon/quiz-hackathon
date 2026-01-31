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
    content: string | string[];
    list?: string[];
  }>;
}> = {
  en: {
    title: "COMMUNITY RULES",
    back: "← BACK",
    lastUpdated: "Last updated:",
    sections: [
      {
        title: "1. WHAT IS StakeStudy?",
        content: "StakeStudy is a High-Stakes Learning platform where university students compete in real-time AI-generated trivia tournaments. Users stake tokens on their own ability to answer correctly, transforming passive and boring study into an exciting competition.",
        list: []
      },
      {
        title: "2. TOKEN SYSTEM",
        content: "Our platform operates under a Token Economy model:",
        list: [
          "Tokens are the internal currency used for tournament participation",
          "Tokens can be purchased through the platform",
          "Winners receive 90% of the tournament pot",
          "The platform retains a 10% service fee",
          "Tokens can be redeemed for rewards (gift cards, discounts, benefits)"
        ]
      },
      {
        title: "3. TOURNAMENT RULES",
        content: "Fair play is guaranteed through our AI system:",
        list: [
          "Each player pays an entry fee in Tokens to join",
          "Questions are generated instantly from uploaded study materials",
          "Questions remain hidden until the tournament starts",
          "The player with the most correct answers wins the pot",
          "In case of a tie, the fastest response time wins"
        ]
      },
      {
        title: "4. FAIR PLAY POLICY",
        content: "StakeStudy is a SKILL-BASED GAME, not gambling:",
        list: [
          "Winning depends 100% on your knowledge, not luck",
          "Our AI acts as an impartial referee",
          "No one has access to answers before the tournament",
          "Using external tools or bots is prohibited",
          "Account sharing is not allowed",
          "Attempting to manipulate results leads to permanent ban"
        ]
      },
      {
        title: "5. CONTENT UPLOAD",
        content: "When uploading study materials:",
        list: [
          "Only upload content you own or have rights to use",
          "Do not upload copyrighted materials without authorization",
          "Content is processed by AI for quiz generation only",
          "Uploaded materials are not shared with third parties",
          "Inappropriate or illegal content is prohibited"
        ]
      },
      {
        title: "6. RESPECT & CONDUCT",
        content: "To maintain a healthy community:",
        list: [
          "Treat all players with respect",
          "Harassment or bullying is not tolerated",
          "Do not share offensive or discriminatory content",
          "Report any suspicious activity",
          "Help maintain a positive learning environment"
        ]
      },
      {
        title: "7. PENALTIES",
        content: "Violations of these rules may result in:",
        list: [
          "Forfeiture of tokens earned through violations",
          "Temporary suspension (1-30 days)",
          "Permanent account ban",
          "Exclusion from all future tournaments",
          "Legal action in serious cases"
        ]
      },
      {
        title: "8. OUR COMMITMENT",
        content: [
          "\"We're not creating gambling addicts, we're creating students obsessed with learning. We use risk psychology to combat academic apathy.\"",
          "StakeStudy uses AI as an impartial referee, guaranteeing fair play and ensuring no one has answers ahead of time. It's like Kahoot, but where you really have skin in the game."
        ],
        list: []
      }
    ]
  },
  es: {
    title: "REGLAS DE LA COMUNIDAD",
    back: "← VOLVER",
    lastUpdated: "Última actualización:",
    sections: [
      {
        title: "1. ¿QUÉ ES StakeStudy?",
        content: "StakeStudy es una plataforma de Aprendizaje de Alto Riesgo donde estudiantes universitarios compiten en torneos de trivia generados por IA en tiempo real. Los usuarios apuestan tokens en su propia capacidad para responder correctamente, transformando el estudio pasivo y aburrido en una competencia emocionante.",
        list: []
      },
      {
        title: "2. SISTEMA DE TOKENS",
        content: "Nuestra plataforma opera bajo un modelo de Economía de Tokens:",
        list: [
          "Los Tokens son la moneda interna para participar en torneos",
          "Los Tokens se pueden comprar a través de la plataforma",
          "Los ganadores reciben el 90% del pozo del torneo",
          "La plataforma retiene un 10% como tarifa de servicio",
          "Los Tokens se pueden canjear por recompensas (tarjetas de regalo, descuentos, beneficios)"
        ]
      },
      {
        title: "3. REGLAS DEL TORNEO",
        content: "El juego limpio está garantizado por nuestro sistema de IA:",
        list: [
          "Cada jugador paga una entrada en Tokens para unirse",
          "Las preguntas se generan instantáneamente del material de estudio subido",
          "Las preguntas permanecen ocultas hasta que inicia el torneo",
          "El jugador con más respuestas correctas gana el pozo",
          "En caso de empate, el tiempo de respuesta más rápido gana"
        ]
      },
      {
        title: "4. POLÍTICA DE JUEGO LIMPIO",
        content: "StakeStudy es un JUEGO DE HABILIDAD, no de azar:",
        list: [
          "Ganar depende 100% de tu conocimiento, no de la suerte",
          "Nuestra IA actúa como árbitro imparcial",
          "Nadie tiene acceso a las respuestas antes del torneo",
          "El uso de herramientas externas o bots está prohibido",
          "No se permite compartir cuentas",
          "Intentar manipular resultados lleva a baneo permanente"
        ]
      },
      {
        title: "5. SUBIDA DE CONTENIDO",
        content: "Al subir materiales de estudio:",
        list: [
          "Solo sube contenido que poseas o tengas derechos de uso",
          "No subas materiales con copyright sin autorización",
          "El contenido es procesado por IA solo para generar quizzes",
          "Los materiales subidos no se comparten con terceros",
          "Está prohibido el contenido inapropiado o ilegal"
        ]
      },
      {
        title: "6. RESPETO Y CONDUCTA",
        content: "Para mantener una comunidad sana:",
        list: [
          "Trata a todos los jugadores con respeto",
          "No se tolera el acoso o bullying",
          "No compartas contenido ofensivo o discriminatorio",
          "Reporta cualquier actividad sospechosa",
          "Ayuda a mantener un ambiente de aprendizaje positivo"
        ]
      },
      {
        title: "7. PENALIZACIONES",
        content: "Las violaciones de estas reglas pueden resultar en:",
        list: [
          "Pérdida de tokens obtenidos mediante violaciones",
          "Suspensión temporal (1-30 días)",
          "Baneo permanente de la cuenta",
          "Exclusión de todos los torneos futuros",
          "Acciones legales en casos graves"
        ]
      },
      {
        title: "8. NUESTRO COMPROMISO",
        content: [
          "\"No estamos creando ludópatas, estamos creando estudiantes obsesionados con aprender. Usamos la psicología del riesgo para combatir la apatía académica.\"",
          "StakeStudy usa la IA como árbitro imparcial, garantizando juego limpio y asegurando que nadie tenga las respuestas antes de tiempo. Es como Kahoot, pero donde realmente te juegas la piel."
        ],
        list: []
      }
    ]
  }
};

export default function RulesPage() {
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
          StakeStudy
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
              
              {Array.isArray(section.content) ? (
                section.content.map((para, i) => (
                  <p key={i} style={{ marginBottom: "15px", fontStyle: i === 0 ? "italic" : "normal" }}>
                    {para}
                  </p>
                ))
              ) : (
                <p style={{ marginBottom: "15px" }}>{section.content}</p>
              )}
              
              {section.list && section.list.length > 0 && (
                <ul style={{ marginLeft: "20px" }}>
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
          © 2026 StakeStudy PROJECT
        </p>
      </footer>
    </div>
  );
}
