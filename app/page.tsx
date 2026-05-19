"use client";

import { useState } from "react";
import FiguitaPreview from "@/components/FiguitaPreview";
import UploadForm from "@/components/UploadForm";

export type FiguitaType = "seleccion" | "club";

export interface FiguitaData {
  type: FiguitaType;
  playerName: string;
  position: string;
  number: string;
  photoUrl: string | null;
}

const DEFAULT_DATA: FiguitaData = {
  type: "seleccion",
  playerName: "",
  position: "",
  number: "",
  photoUrl: null,
};

export default function Home() {
  const [data, setData] = useState<FiguitaData>(DEFAULT_DATA);
  const [step, setStep] = useState<"form" | "preview">("form");

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-yellow-500 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
        Figuritas 2026
      </h1>
      <p className="text-sky-200 text-sm mb-8">
        Selección &amp; Clubes de Hurlingham
      </p>

      {step === "form" ? (
        <UploadForm
          data={data}
          onChange={setData}
          onNext={() => setStep("preview")}
        />
      ) : (
        <FiguitaPreview data={data} onBack={() => setStep("form")} />
      )}
    </main>
  );
}
