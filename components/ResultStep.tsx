"use client";

import type { GeneratedFiguritas, UserData } from "@/lib/types";

interface Props {
  figuritas: GeneratedFiguritas;
  userData: UserData;
}

export default function ResultStep({ figuritas, userData }: Props) {
  const slug = `${userData.apellido}-${userData.nombre}`.toLowerCase();

  function download(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-white font-black text-2xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        ¡Tus figuritas están listas!
      </p>

      <div className="flex gap-8 flex-wrap justify-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src={figuritas.seleccion}
            alt="Figurita Selección"
            style={{ width: 280, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.35)", display: "block" }}
          />
          <button
            onClick={() => download(figuritas.seleccion, `figurita-seleccion-${slug}.png`)}
            className="px-6 py-2 rounded-xl bg-white text-[#00B5AD] font-black hover:bg-white/90 transition-all shadow-lg"
          >
            Descargar Selección
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <img
            src={figuritas.club}
            alt="Figurita Club"
            style={{ width: 280, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.35)", display: "block" }}
          />
          <button
            onClick={() => download(figuritas.club, `figurita-club-${slug}.png`)}
            className="px-6 py-2 rounded-xl bg-white text-[#00B5AD] font-black hover:bg-white/90 transition-all shadow-lg"
          >
            Descargar Club
          </button>
        </div>
      </div>

      <p className="text-white/70 text-xs mt-2">
        Compartí tus figuritas con el hashtag #FiguitasHurlingham
      </p>
    </div>
  );
}
