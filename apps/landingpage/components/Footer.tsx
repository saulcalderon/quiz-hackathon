export default function Footer() {
  return (
    <footer
      style={{
        paddingTop: "2.5rem",
        paddingBottom: "2.5rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div 
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        {/* Logo */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}
        >
          <span
            style={{ 
              fontFamily: "var(--font-heading)",
              fontSize: "1.125rem",
              fontWeight: 700
            }}
          >
            Skill<span style={{ color: "var(--neon-green)" }}>Stake</span>
          </span>
        </div>

        {/* Links */}
        <div 
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem"
          }}
        >
          {["Términos", "Reglas de la Comunidad"].map((link) => (
            <a
              key={link}
              href="#"
              style={{ 
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                transition: "color 0.3s"
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Disclaimer - CENTERED */}
        <p
          style={{ 
            color: "var(--text-muted)", 
            opacity: 0.6,
            fontSize: "0.75rem",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "1rem",
            lineHeight: 1.6,
            textAlign: "center"
          }}
        >
          SkillStake es una plataforma de educación gamificada. Los
          &quot;Tokens&quot; son unidades de puntaje virtual y no representan
          apuestas con dinero fiduciario. El objetivo es incentivar el hábito de
          estudio.
        </p>

        {/* Copyright */}
        <p
          style={{ 
            color: "var(--text-muted)", 
            opacity: 0.5,
            fontSize: "0.75rem",
            textAlign: "center"
          }}
        >
          © 2024 SkillStake Project.
        </p>
      </div>
    </footer>
  );
}
