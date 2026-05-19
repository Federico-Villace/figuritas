"use client";

import { useRef } from "react";
import FiguitaCard from "@/components/FiguitaCard";
import type { FiguitaData } from "@/app/page";

interface Props {
  data: FiguitaData;
  onBack: () => void;
}

export default function FiguitaPreview({ data, onBack }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    const { toPng } = await import("html-to-image");
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = `figurita-${data.playerName.toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={cardRef}>
        <FiguitaCard data={data} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all font-semibold"
        >
          ← Editar
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-2 rounded-xl bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-all font-black"
        >
          Descargar
        </button>
      </div>
    </div>
  );
}
