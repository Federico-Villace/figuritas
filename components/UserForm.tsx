"use client";

import { useRef } from "react";
import { CLUBS_HURLINGHAM } from "@/lib/clubs";
import type { UserData } from "@/lib/types";

interface Props {
  userData: UserData;
  onChange: (partial: Partial<UserData>) => void;
  onSubmit: () => void;
}

const inputClass = "w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#00B5AD] border border-gray-200";
const labelClass = "text-[#008f89] text-sm font-bold mb-1 block";

export default function UserForm({ userData, onChange, onSubmit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const isValid =
    userData.nombre.trim() &&
    userData.apellido.trim() &&
    userData.barrio.trim() &&
    userData.edad.trim() &&
    userData.club &&
    userData.photoFile;

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-5 shadow-2xl">
      {/* Nombre y Apellido */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>Nombre</label>
          <input
            type="text"
            placeholder="Federico"
            value={userData.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass}>Apellido</label>
          <input
            type="text"
            placeholder="Villace"
            value={userData.apellido}
            onChange={(e) => onChange({ apellido: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Apodo */}
      <div>
        <label className={labelClass}>Apodo</label>
        <input
          type="text"
          placeholder="El Negro, Pelusa, Chucky..."
          value={userData.apodo}
          onChange={(e) => onChange({ apodo: e.target.value.toUpperCase() })}
          className={inputClass}
        />
      </div>

      {/* Barrio y Edad */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>Barrio</label>
          <input
            type="text"
            placeholder="Villa Tesei"
            value={userData.barrio}
            onChange={(e) => onChange({ barrio: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="w-20">
          <label className={labelClass}>Edad</label>
          <input
            type="number"
            min={5}
            max={99}
            placeholder="28"
            value={userData.edad}
            onChange={(e) => onChange({ edad: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Club */}
      <div>
        <label className={labelClass}>Club de barrio</label>
        <select
          value={userData.club}
          onChange={(e) => onChange({ club: e.target.value as UserData["club"] })}
          className={inputClass}
        >
          <option value="" disabled>Elegí tu club</option>
          {CLUBS_HURLINGHAM.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Foto */}
      <div>
        <label className={labelClass}>Foto de frente</label>
        <p className="text-gray-400 text-xs mb-2">
          Cabeza y hombros, mirando a la cámara, fondo liso, buena luz.
        </p>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl h-36 flex items-center justify-center cursor-pointer hover:border-[#00B5AD] transition-colors overflow-hidden"
        >
          {userData.photoFile ? (
            <img
              src={URL.createObjectURL(userData.photoFile)}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">Subí tu foto</span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onChange({ photoFile: file });
          }}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!isValid}
        className="w-full py-3 rounded-xl font-black bg-[#00B5AD] hover:bg-[#008f89] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Generar mis figuritas ✨
      </button>
    </div>
  );
}
