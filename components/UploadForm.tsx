"use client";

import { useRef } from "react";
import type { FiguitaData, FiguitaType } from "@/app/page";

interface Props {
  data: FiguitaData;
  onChange: (data: FiguitaData) => void;
  onNext: () => void;
}

const POSITIONS = ["ARQ", "DEF", "MED", "DEL"];

export default function UploadForm({ data, onChange, onNext }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ ...data, photoUrl: url });
  }

  const isValid =
    data.playerName.trim() &&
    data.position &&
    data.number.trim() &&
    data.photoUrl;

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-8 w-full max-w-md space-y-5">
      {/* Tipo de figurita */}
      <div>
        <p className="text-white text-sm font-semibold mb-2">Tipo de figurita</p>
        <div className="flex gap-3">
          {(["seleccion", "club"] as FiguitaType[]).map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...data, type: t })}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                data.type === t
                  ? "bg-yellow-400 text-blue-900"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {t === "seleccion" ? "🇦🇷 Selección" : "⚽ Club Hurlingham"}
            </button>
          ))}
        </div>
      </div>

      {/* Foto */}
      <div>
        <p className="text-white text-sm font-semibold mb-2">Tu foto</p>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/40 rounded-xl h-32 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors overflow-hidden"
        >
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-white/60 text-sm">Hacé click para subir</span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      {/* Nombre */}
      <div>
        <p className="text-white text-sm font-semibold mb-2">Nombre</p>
        <input
          type="text"
          placeholder="VILLACE"
          value={data.playerName}
          onChange={(e) => onChange({ ...data, playerName: e.target.value.toUpperCase() })}
          className="w-full bg-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Posición y número */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-white text-sm font-semibold mb-2">Posición</p>
          <select
            value={data.position}
            onChange={(e) => onChange({ ...data, position: e.target.value })}
            className="w-full bg-white/20 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="" disabled className="text-black">—</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p} className="text-black">{p}</option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <p className="text-white text-sm font-semibold mb-2">Número</p>
          <input
            type="number"
            min={1}
            max={99}
            placeholder="10"
            value={data.number}
            onChange={(e) => onChange({ ...data, number: e.target.value })}
            className="w-full bg-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3 rounded-xl font-black text-blue-900 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Ver mi figurita →
      </button>
    </div>
  );
}
