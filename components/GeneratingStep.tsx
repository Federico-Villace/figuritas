"use client";

import { useEffect } from "react";
import type { UserData, GeneratedFiguritas } from "@/lib/types";

interface Props {
  userData: UserData;
  onDone: (result: GeneratedFiguritas) => void;
  onError: () => void;
}

export default function GeneratingStep({ userData, onDone, onError }: Props) {
  useEffect(() => {
    async function generate() {
      try {
        const form = new FormData();
        form.append("email", userData.email);
        form.append("nombre", userData.nombre);
        form.append("apellido", userData.apellido);
        form.append("apodo", userData.apodo);
        form.append("barrio", userData.barrio);
        form.append("edad", userData.edad);
        form.append("club", userData.club);
        if (userData.photoFile) form.append("photo", userData.photoFile);

        const res = await fetch("/api/generate", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        onDone(data as GeneratedFiguritas);
      } catch {
        onError();
      }
    }

    generate();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
      <div>
        <p className="text-white font-black text-xl">Generando tus figuritas...</p>
        <p className="text-white/70 text-sm mt-1">La IA está trabajando, puede tardar unos segundos.</p>
      </div>
    </div>
  );
}
