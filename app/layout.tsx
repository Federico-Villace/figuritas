import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Figuritas 2026 — Hurlingham",
  description: "Generá tu figurita del Mundial 2026 con la camiseta de tu club de Hurlingham",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Figuritas 2026",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
