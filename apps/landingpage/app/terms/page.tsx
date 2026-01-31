"use client";

import Link from "next/link";

export default function TermsPage() {
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
          SKILLSTAKE
        </Link>

        <Link 
          href="/"
          className="btn btn-secondary"
          style={{ textDecoration: "none" }}
        >
          ← BACK
        </Link>
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
          TERMS & CONDITIONS
        </h1>

        <div style={{ lineHeight: 1.8, color: "var(--black)" }}>
          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              1. ACCEPTANCE OF TERMS
            </h2>
            <p style={{ marginBottom: "15px" }}>
              By accessing and using SkillStake, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by these terms, 
              please do not use this service.
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              2. DESCRIPTION OF SERVICE
            </h2>
            <p style={{ marginBottom: "15px" }}>
              SkillStake is a gamified education platform that allows users to:
            </p>
            <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
              <li style={{ marginBottom: "10px" }}>Upload study materials for AI-generated quizzes</li>
              <li style={{ marginBottom: "10px" }}>Compete in knowledge-based tournaments</li>
              <li style={{ marginBottom: "10px" }}>Earn and redeem virtual tokens</li>
              <li style={{ marginBottom: "10px" }}>Track learning progress and statistics</li>
            </ul>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              3. VIRTUAL TOKENS
            </h2>
            <p style={{ marginBottom: "15px" }}>
              <strong>Important:</strong> SkillStake tokens are virtual score units used exclusively 
              within the platform for educational gamification purposes. They:
            </p>
            <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
              <li style={{ marginBottom: "10px" }}>Have no real-world monetary value</li>
              <li style={{ marginBottom: "10px" }}>Cannot be exchanged for fiat currency</li>
              <li style={{ marginBottom: "10px" }}>Are non-transferable outside the platform</li>
              <li style={{ marginBottom: "10px" }}>May only be used to redeem in-platform benefits</li>
            </ul>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              4. USER CONDUCT
            </h2>
            <p style={{ marginBottom: "15px" }}>
              Users agree not to:
            </p>
            <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
              <li style={{ marginBottom: "10px" }}>Use automated systems or bots</li>
              <li style={{ marginBottom: "10px" }}>Share account credentials</li>
              <li style={{ marginBottom: "10px" }}>Upload copyrighted material without authorization</li>
              <li style={{ marginBottom: "10px" }}>Attempt to manipulate quiz results</li>
              <li style={{ marginBottom: "10px" }}>Engage in any form of cheating</li>
            </ul>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              5. FAIR PLAY POLICY
            </h2>
            <p style={{ marginBottom: "15px" }}>
              Our AI-powered validation system monitors all quiz sessions for fairness. 
              Any detected violations may result in:
            </p>
            <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
              <li style={{ marginBottom: "10px" }}>Forfeiture of tokens earned</li>
              <li style={{ marginBottom: "10px" }}>Temporary or permanent account suspension</li>
              <li style={{ marginBottom: "10px" }}>Exclusion from tournaments</li>
            </ul>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              6. PRIVACY
            </h2>
            <p style={{ marginBottom: "15px" }}>
              We collect and process user data in accordance with our Privacy Policy. 
              Uploaded study materials are processed by AI for quiz generation and are 
              not shared with third parties.
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                marginBottom: "15px",
                textTransform: "uppercase"
              }}
            >
              7. MODIFICATIONS
            </h2>
            <p style={{ marginBottom: "15px" }}>
              SkillStake reserves the right to modify these terms at any time. 
              Users will be notified of significant changes via email or in-app notification.
            </p>
          </section>

          <div
            className="neo-box"
            style={{
              background: "var(--yellow)",
              padding: "20px",
              marginTop: "40px"
            }}
          >
            <p style={{ fontWeight: 700, textAlign: "center" }}>
              Last updated: January 2024
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
          © 2024 SKILLSTAKE PROJECT
        </p>
      </footer>
    </div>
  );
}
