"use client";

import type { FiguitaData } from "@/app/page";

interface Props {
  data: FiguitaData;
}

const THEME = {
  seleccion: {
    bg: "from-sky-500 to-blue-700",
    accent: "#F5C600",
    badge: "🇦🇷",
    label: "ARGENTINA",
  },
  club: {
    bg: "from-green-600 to-green-900",
    accent: "#F5C600",
    badge: "⚽",
    label: "HURLINGHAM",
  },
};

export default function FiguitaCard({ data }: Props) {
  const theme = THEME[data.type];

  return (
    <div
      className={`relative w-48 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b ${theme.bg} select-none`}
      style={{ aspectRatio: "2/3", fontFamily: "sans-serif" }}
    >
      {/* Header strip */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-1 z-10"
        style={{ backgroundColor: theme.accent }}
      >
        <span className="text-blue-900 text-[10px] font-black tracking-widest">
          {theme.label}
        </span>
        <span className="text-lg">{theme.badge}</span>
      </div>

      {/* Number */}
      <div className="absolute top-6 left-3 z-10">
        <span className="text-white text-4xl font-black opacity-20 leading-none">
          {data.number || "?"}
        </span>
      </div>

      {/* Photo */}
      <div className="absolute inset-0 top-7">
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={data.playerName}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <span className="text-5xl">👤</span>
          </div>
        )}
        {/* gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 z-10">
        <div
          className="text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block"
          style={{ backgroundColor: theme.accent, color: "#1e3a5f" }}
        >
          {data.position || "POS"}
        </div>
        <p className="text-white font-black text-sm tracking-wider leading-tight uppercase">
          {data.playerName || "TU NOMBRE"}
        </p>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}
