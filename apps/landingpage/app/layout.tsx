import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StakeStudy | Tokenized Learning",
  description: "Convierte tus PDFs de estudio en torneos gamificados. Acumula Skill Tokens, sube en el ranking y canjea recompensas. La IA es el árbitro.",
  keywords: ["educación", "gamificación", "blockchain", "tokens", "estudio", "quiz", "IA"],
  authors: [{ name: "StakeStudy Project" }],
  openGraph: {
    title: "StakeStudy | Tokenized Learning",
    description: "Tu conocimiento es tu divisa. Convierte tus apuntes en competiciones.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
