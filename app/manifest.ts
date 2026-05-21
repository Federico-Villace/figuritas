import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Figuritas 2026 — Hurlingham",
    short_name: "Figuritas 2026",
    description: "Generá tu figurita del Mundial 2026 con la camiseta de tu club",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#00B5AD",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
