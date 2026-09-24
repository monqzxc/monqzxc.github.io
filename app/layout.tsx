import type { Metadata } from "next";
import "./globals.css";
import "./glass-theme.css";
import "./hero.css";
import "./pokemon-theme.css";
import "./scroll-reveal.css";

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
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
