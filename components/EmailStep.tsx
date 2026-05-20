"use client";

import { useState } from "react";

interface Props {
  onVerified: (email: string) => void;
  onAlreadyGenerated: () => void;
}

export default function EmailStep({ onVerified, onAlreadyGenerated }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error inesperado");
        return;
      }

      if (data.alreadyGenerated) {
        onAlreadyGenerated();
      } else {
        onVerified(email);
      }
    } catch {
      setError("No se pudo conectar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-5 shadow-2xl">
      <div>
        <p className="text-[#008f89] font-bold mb-1">Tu email</p>
        <p className="text-gray-500 text-xs mb-3">
          Podés generar tus figuritas una sola vez. Usamos el mail para verificarlo.
        </p>
        <input
          type="email"
          required
          placeholder="vos@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00B5AD] border border-gray-200"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full py-3 rounded-xl font-black bg-[#00B5AD] hover:bg-[#008f89] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Verificando..." : "Continuar →"}
      </button>
    </form>
  );
}
