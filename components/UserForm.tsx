"use client";

import { useRef } from "react";
import { CLUBS_HURLINGHAM } from "@/lib/clubs";
import type { UserData } from "@/lib/types";

interface Props {
  userData: UserData;
  onChange: (partial: Partial<UserData>) => void;
  onSubmit: () => void;
}

const inputClass = "w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#00B5AD] border border-gray-200 text-sm";
const labelClass = "text-[#008f89] text-xs font-bold mb-0.5 block";

export default function UserForm({ userData, onChange, onSubmit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const isValid =
    userData.nombre.trim() &&
    userData.apellido.trim() &&
    userData.barrio.trim() &&
    userData.edad.trim() &&
    userData.club &&
    userData.photoFile;

  return (
    <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-3 shadow-2xl">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Nombre</label>
          <input type="text" placeholder="Federico" value={userData.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })} className={inputClass} />
        </div>
        <div className="flex-1">
          <label className={labelClass}>Apellido</label>
          <input type="text" placeholder="Villace" value={userData.apellido}
            onChange={(e) => onChange({ apellido: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Apodo</label>
        <input type="text" placeholder="El Negro, Pelusa, Chucky..." value={userData.apodo}
          onChange={(e) => onChange({ apodo: e.target.value.toUpperCase() })} className={inputClass} />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Barrio</label>
          <input type="text" placeholder="Villa Tesei" value={userData.barrio}
            onChange={(e) => onChange({ barrio: e.target.value })} className={inputClass} />
        </div>
        <div className="w-20">
          <label className={labelClass}>Edad</label>
          <input type="number" min={5} max={99} placeholder="28" value={userData.edad}
            onChange={(e) => onChange({ edad: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Club de barrio</label>
        <select value={userData.club}
          onChange={(e) => onChange({ club: e.target.value as UserData["club"] })} className={inputClass}>
          <option value="" disabled>Elegí tu club</option>
          {CLUBS_HURLINGHAM.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Foto de frente</label>
        {userData.photoFile ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl h-20 flex items-center justify-center cursor-pointer hover:border-[#00B5AD] transition-colors overflow-hidden"
          >
            <img src={URL.createObjectURL(userData.photoFile)} alt="preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="md:hidden flex-1 border-2 border-dashed border-gray-300 rounded-xl h-20 flex flex-col items-center justify-center gap-1 hover:border-[#00B5AD] transition-colors"
            >
              <span className="text-xl">📷</span>
              <span className="text-gray-400 text-xs">Cámara</span>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-1 border-2 border-dashed border-gray-300 rounded-xl h-20 flex flex-col items-center justify-center gap-1 hover:border-[#00B5AD] transition-colors"
            >
              <span className="text-xl">🖼️</span>
              <span className="text-gray-400 text-xs">Galería</span>
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => onChange({ photoFile: e.target.files?.[0] ?? null })} />
        <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden"
          onChange={(e) => onChange({ photoFile: e.target.files?.[0] ?? null })} />
      </div>

      <button onClick={onSubmit} disabled={!isValid}
        className="w-full py-2.5 rounded-xl font-black bg-[#00B5AD] hover:bg-[#008f89] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">
        Generar mis figuritas ✨
      </button>
    </div>
  );
}
