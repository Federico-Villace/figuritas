"use client";

import { useState } from "react";
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
    email: "",
    nombre: "",
    apellido: "",
    apodo: "",
    barrio: "",
    edad: "",
    club: "",
    photoFile: null,
  });
  const [figuritas, setFiguritas] = useState<GeneratedFiguritas | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #008f89 0%, #00B5AD 50%, #00d4cc 100%)" }}>
      <h1 className="text-5xl font-black text-white mb-2 tracking-tight" style={{ textShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
        Figuritas 2026
      </h1>
      <p className="text-white font-semibold text-sm mb-8 opacity-90">Selección &amp; Clubes de Hurlingham</p>

      {step === "email" && (
        <EmailStep
          onVerified={(email) => {
            setUserData((d) => ({ ...d, email }));
            setStep("form");
          }}
          onAlreadyGenerated={() => setStep("already-generated")}
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
          onDone={(result) => {
            setFiguritas(result);
            setStep("result");
          }}
          onError={() => setStep("form")}
        />
      )}

      {step === "result" && figuritas && (
        <ResultStep figuritas={figuritas} userData={userData} />
      )}

      {step === "already-generated" && <AlreadyGeneratedStep />}
    </main>
  );
}
