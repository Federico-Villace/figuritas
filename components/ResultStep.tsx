"use client";

import { useRef } from "react";
import type { GeneratedFiguritas, UserData } from "@/lib/types";
import FiguitaCard from "@/components/FiguitaCard";

interface Props {
  figuritas: GeneratedFiguritas;
  userData: UserData;
}

export default function ResultStep({ figuritas, userData }: Props) {
  const seleccionRef = useRef<HTMLDivElement>(null);
  const clubRef = useRef<HTMLDivElement>(null);

  async function download(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    const { toPng } = await import("html-to-image");
    if (!ref.current) return;
    const url = await toPng(ref.current, { pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
  }

  const slug = `${userData.apellido}-${userData.nombre}`.toLowerCase();

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-white font-black text-2xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        ¡Tus figuritas están listas!
      </p>

      <div className="flex gap-8 flex-wrap justify-center">
        <div className="flex flex-col items-center gap-3">
          <div ref={seleccionRef}>
            <FiguitaCard userData={userData} type="seleccion" photoUrl={figuritas.seleccion} />
          </div>
          <button
            onClick={() => download(seleccionRef, `figurita-seleccion-${slug}.png`)}
            className="px-6 py-2 rounded-xl bg-white text-[#00B5AD] font-black hover:bg-white/90 transition-all shadow-lg"
          >
            Descargar Selección
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div ref={clubRef}>
            <FiguitaCard userData={userData} type="club" photoUrl={figuritas.club} />
          </div>
          <button
            onClick={() => download(clubRef, `figurita-club-${slug}.png`)}
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
