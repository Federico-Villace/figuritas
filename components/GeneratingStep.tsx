"use client";

import { useEffect, useState } from "react";
import type { UserData, GeneratedFiguritas } from "@/lib/types";

interface Props {
  userData: UserData;
  onDone: (result: GeneratedFiguritas) => void;
  onError: () => void;
}

export default function GeneratingStep({ userData, onDone, onError }: Props) {
  const [seleccion, setSeleccion] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      try {
        const form = new FormData();
        form.append("email", userData.email);
        form.append("nombre", userData.nombre);
        form.append("apellido", userData.apellido);
        form.append("apodo", userData.apodo);
        form.append("barrio", userData.barrio);
        form.append("nacimiento", userData.nacimiento);
        form.append("dni", userData.dni);
        form.append("club", userData.club);
        if (userData.photoFile) form.append("photo", userData.photoFile);

        const res = await fetch("/api/generate", { method: "POST", body: form });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let seleccionUrl = "";
        let clubUrl = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const chunk = JSON.parse(line) as { type: string; url?: string; message?: string };

            if (chunk.type === "seleccion" && chunk.url) {
              seleccionUrl = chunk.url;
              setSeleccion(chunk.url);
            } else if (chunk.type === "club" && chunk.url) {
              clubUrl = chunk.url;
            } else if (chunk.type === "error") {
              throw new Error(chunk.message);
            } else if (chunk.type === "done") {
              onDone({ seleccion: seleccionUrl, club: clubUrl });
            }
          }
        }
      } catch {
        onError();
      }
    }

    generate();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center w-full max-w-md">
      {seleccion ? (
        <>
          <p className="text-white font-black text-xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            ¡Primera figurita lista!
          </p>
          <img
            src={seleccion}
            alt="Figurita Selección"
            style={{ width: 260, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
          />
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <p className="text-sm">Generando tu figurita del club...</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-white font-black text-xl">Generando tus figuritas...</p>
            <p className="text-white/70 text-sm mt-1">La IA está trabajando, puede tardar unos segundos.</p>
          </div>
        </>
      )}
    </div>
  );
}
