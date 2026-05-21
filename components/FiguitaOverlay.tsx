"use client";

import type { UserData } from "@/lib/types";

interface Props {
  photoUrl: string;
  userData: UserData;
  type: "seleccion" | "club";
}

export default function FiguitaOverlay({ photoUrl, userData, type }: Props) {
  const nombre = (userData.apodo || userData.nombre).toUpperCase();
  const nacimiento = new Date().getFullYear() - Number(userData.edad);
  const club = type === "seleccion" ? "Selección Argentina" : userData.club;
  const pillColor = type === "seleccion" ? "#1a3560" : "#0f3d22";

  return (
    <div
      style={{
        position: "relative",
        width: 280,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      <img
        src={photoUrl}
        alt={nombre}
        style={{ width: "100%", display: "block" }}
      />

      {/* Overlay sobre el área de datos del template */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#e4eef0",
          padding: "7px 10px 8px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <div style={{ background: pillColor, borderRadius: 20, padding: "2px 12px" }}>
            <span style={{
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 14, fontWeight: 600, color: "white", letterSpacing: 0.5,
            }}>
              {nombre}
            </span>
          </div>
          <span style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontSize: 10, fontWeight: 300, color: "#4a5568",
          }}>
            {nacimiento}&nbsp;|&nbsp;{userData.barrio}
          </span>
        </div>

        {/* Club | Barrio */}
        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.1)",
            paddingTop: 3,
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontSize: 9,
            fontWeight: 300,
            color: "#4a5568",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{club}</span>
          <span>{userData.barrio.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
