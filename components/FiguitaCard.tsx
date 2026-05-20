"use client";

import type { UserData } from "@/lib/types";

interface Props {
  userData: UserData;
  type: "seleccion" | "club";
  photoUrl: string;
}

// Teal exacto del template Panini 2026
const TEAL = "#00B5AD";
const TEAL_DARK = "#009690";

export default function FiguitaCard({ userData, type, photoUrl }: Props) {
  const isSeleccion = type === "seleccion";
  const displayName = (userData.apodo || userData.apellido).toUpperCase();

  return (
    <div
      style={{
        width: 300,
        height: 420,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: TEAL,
        boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
        fontFamily: "Arial Black, Arial, sans-serif",
        userSelect: "none",
      }}
    >
      {/* --- Número "26" gigante de fondo --- */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        overflow: "hidden", pointerEvents: "none",
      }}>
        {/* "2" izquierda */}
        <span style={{
          position: "absolute", left: -10, top: 10,
          fontSize: 220, fontWeight: 900, lineHeight: 1,
          color: isSeleccion ? "#1a6bbf" : "#0f5c3a",
          opacity: 0.85,
        }}>2</span>
        {/* "6" derecha (parcialmente oculto) */}
        <span style={{
          position: "absolute", right: -30, bottom: 60,
          fontSize: 220, fontWeight: 900, lineHeight: 1,
          color: "rgba(255,255,255,0.25)",
        }}>6</span>
      </div>

      {/* --- Logo tipo "26 FIFA" top right --- */}
      <div style={{
        position: "absolute", top: 10, right: 12, zIndex: 3,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 22, fontWeight: 900, color: "white",
          lineHeight: 1, letterSpacing: -1,
        }}>26</div>
        <div style={{
          fontSize: 8, color: "white", fontWeight: 700,
          letterSpacing: 2, marginTop: 1,
        }}>2026</div>
      </div>

      {/* --- Foto principal --- */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
      }}>
        <img
          src={photoUrl}
          alt={displayName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
        {/* Fade inferior sobre la foto */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent 65%)",
        }} />
      </div>

      {/* --- Badge circular bandera (derecha centro) --- */}
      <div style={{
        position: "absolute", right: 10, top: "48%",
        zIndex: 4,
        width: 42, height: 42,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.6)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        background: isSeleccion
          ? "linear-gradient(to bottom, #74acdf 0%, #74acdf 33%, white 33%, white 66%, #74acdf 66%)"
          : "#1a4a2e",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!isSeleccion && (
          <span style={{ fontSize: 20 }}>⚽</span>
        )}
        {isSeleccion && (
          /* Sol de Mayo simple */
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: "#F6B40E",
            marginTop: 4,
          }} />
        )}
      </div>

      {/* --- Barra nombre (fondo oscuro redondeado) --- */}
      <div style={{
        position: "absolute", bottom: 36, left: 12, right: 12,
        zIndex: 5,
        background: isSeleccion ? "#1a3560" : "#0f3d22",
        borderRadius: 20,
        padding: "6px 16px",
        textAlign: "center",
      }}>
        <span style={{
          color: "white",
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}>
          {displayName}
        </span>
      </div>

      {/* --- Barra inferior delgada (donde iría el logo Panini) --- */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 32, zIndex: 5,
        background: TEAL_DARK,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: 1 }}>
          {isSeleccion ? "SELECCIÓN" : "HURLINGHAM"}
        </span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: 1 }}>
          {userData.barrio.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
