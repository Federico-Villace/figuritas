"use client";

import { useState } from "react";
import Image from "next/image";
import EmailStep from "@/components/EmailStep";
import UserForm from "@/components/UserForm";
import GeneratingStep from "@/components/GeneratingStep";
import ResultStep from "@/components/ResultStep";
import AlreadyGeneratedStep from "@/components/AlreadyGeneratedStep";
import type { Step, UserData, GeneratedFiguritas } from "@/lib/types";

export type { Step, UserData, GeneratedFiguritas } from "@/lib/types";

export default function Home() {
  const [step, setStep] = useState<Step>("email");
  const [userData, setUserData] = useState<UserData>({
    email: "", nombre: "", apellido: "", apodo: "",
    barrio: "", edad: "", club: "", photoFile: null,
  });
  const [figuritas, setFiguritas] = useState<GeneratedFiguritas | null>(null);
  const [savedFiguritas, setSavedFiguritas] = useState<{ seleccion: string; club: string } | null>(null);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">

      {/* Fondo de pantalla */}
      <Image
        src="/templates/fifa-26.webp"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Capa semitransparente para que el contenido se lea bien */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {step !== "form" && (
          <>
            <h1
              className="font-black text-white leading-none tracking-tighter mb-1 text-center"
              style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
            >
              TU FIGURITA
            </h1>
            <p className="text-white/70 text-sm mb-8 font-light">
              Selección Argentina &amp; Clubes de Hurlingham
            </p>
          </>
        )}

        {step === "email" && (
          <EmailStep
            onVerified={(email) => { setUserData((d) => ({ ...d, email })); setStep("form"); }}
            onAlreadyGenerated={(figs) => { setSavedFiguritas(figs); setStep("already-generated"); }}
          />
        )}
        {step === "form" && (
          <UserForm
            userData={userData}
            onChange={(partial) => setUserData((d) => ({ ...d, ...partial }))}
            onSubmit={() => setStep("generating")}
          />
        )}
        {step === "generating" && (
          <GeneratingStep
            userData={userData}
            onDone={(result) => { setFiguritas(result); setStep("result"); }}
            onError={() => setStep("form")}
          />
        )}
        {step === "result" && figuritas && (
          <ResultStep figuritas={figuritas} userData={userData} />
        )}
        {step === "already-generated" && <AlreadyGeneratedStep figuritas={savedFiguritas} />}

        <p className="text-white/30 text-xs mt-8">#FiguitasHurlingham</p>
      </div>
    </main>
  );
}
