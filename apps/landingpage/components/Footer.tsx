export default function Footer() {
  return (
    <footer
      className="py-10 px-6"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="container mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Skill<span style={{ color: "var(--neon-green)" }}>Stake</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-6 mb-6">
          {["Términos", "Reglas de la Comunidad"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm transition-colors duration-300 hover:text-white"
              style={{ color: "var(--text-muted)" }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          className="text-xs max-w-lg mx-auto mb-4 leading-relaxed"
          style={{ color: "var(--text-muted)", opacity: 0.6 }}
        >
          SkillStake es una plataforma de educación gamificada. Los
          &quot;Tokens&quot; son unidades de puntaje virtual y no representan
          apuestas con dinero fiduciario. El objetivo es incentivar el hábito de
          estudio.
        </p>

        {/* Copyright */}
        <p
          className="text-xs"
          style={{ color: "var(--text-muted)", opacity: 0.5 }}
        >
          © 2024 SkillStake Project.
        </p>
      </div>
    </footer>
  );
}
