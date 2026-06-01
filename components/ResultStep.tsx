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

      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 text-center space-y-2">
        <p className="text-white font-black text-lg leading-tight">
          ¡Ya podés descargar tu figurita del Mundial 2026!
        </p>
        <p className="text-white/90 text-sm leading-relaxed">
          Porque los sueños empiezan en el club del barrio, ahora vos también sos protagonista de esta pasión que nos une ⚽🇦🇷
        </p>
        <p className="text-white/80 text-sm">
          Tu figurita ya está lista para compartir con amigos, familia y compañeros de equipo.
        </p>
        <p className="text-white font-black text-sm pt-1">
          Del club al Mundial. El sueño empieza acá.
        </p>
      </div>

      <p className="text-white/70 text-xs bg-black/20 rounded-lg px-4 py-2">
        Podés volver a descargarlas ingresando tu email durante los próximos <strong>15 días</strong>.
      </p>
      <p className="text-white/50 text-xs">
        Compartí tus figuritas con el hashtag #FiguitasHurlingham
      </p>
    </div>
  );
}
