import type { Metadata } from "next";
import "./globals.css";
import "./glass-theme.css";
import "./hero.css";
import "./pokemon-theme.css";
import "./ground-theme.css";
import "./pokemon-habitat.css";
import "./scroll-reveal.css";
import { PokemonThemeProvider } from "@/components/pokemon-theme";

export const metadata: Metadata = {
  title: "Mon — Anthony Cabigayan · Software Engineer",
  description: "Anthony Cabigayan (Mon) builds thoughtful digital experiences and dependable enterprise systems. Explore his work in performance management, recruitment, and HRIS.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.pokemonTheme=localStorage.getItem("mon-pokemon-theme")==="gible"?"gible":"gengar"}catch{document.documentElement.dataset.pokemonTheme="gengar"}` }} />
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased"><PokemonThemeProvider>{children}</PokemonThemeProvider></body>
    </html>
  );
}
