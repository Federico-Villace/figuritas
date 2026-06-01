"use client";

import { useState, useRef } from "react";
import { JERSEYS, jerseyLabel } from "@/lib/clubs";
import type { UserData } from "@/lib/types";

interface Props {
  userData: UserData;
  onChange: (partial: Partial<UserData>) => void;
  onSubmit: () => void;
}

const inputClass = "w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#00B5AD] border border-gray-200 text-sm";
const inputErrorClass = "w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-400 border border-red-400 text-sm";
const labelClass = "text-[#008f89] text-xs font-bold mb-0.5 block";
const errorClass = "text-red-500 text-xs mt-0.5";

type Errors = Partial<Record<keyof UserData, string>>;

function validate(d: UserData): Errors {
  const e: Errors = {};
  if (!d.nombre.trim()) e.nombre = "Ingresá tu nombre.";
  if (!d.apellido.trim()) e.apellido = "Ingresá tu apellido.";
  if (!d.barrio.trim()) e.barrio = "Ingresá tu barrio.";
  const nac = Number(d.nacimiento);
  if (!d.nacimiento.trim()) e.nacimiento = "Ingresá tu año de nacimiento.";
  else if (isNaN(nac) || nac < 1920 || nac > new Date().getFullYear())
    e.nacimiento = "Año inválido.";
  if (!d.dni.trim()) e.dni = "Ingresá tu DNI.";
  else if (d.dni.length < 7 || d.dni.length > 8) e.dni = "El DNI debe tener 7 u 8 dígitos.";
  if (!d.club) e.club = "Elegí tu camiseta.";
  if (!d.photoFile) e.photoFile = "Subí una foto.";
  return e;
}

function cls(field: keyof UserData, errors: Errors, hasValue: boolean) {
  return errors[field] ? inputErrorClass : inputClass;
}

export default function UserForm({ userData, onChange, onSubmit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Errors>({});

  function handleChange<K extends keyof UserData>(partial: Partial<UserData>) {
    onChange(partial);
    const key = Object.keys(partial)[0] as keyof UserData;
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit() {
    const e = validate(userData);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onSubmit();
  }

  return (
    <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-3 shadow-2xl">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Nombre</label>
          <input type="text" placeholder="Juan" value={userData.nombre}
            onChange={(e) => handleChange({ nombre: e.target.value })}
            className={cls("nombre", errors, !!userData.nombre)} />
          {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
        </div>
        <div className="flex-1">
          <label className={labelClass}>Apellido</label>
          <input type="text" placeholder="Pérez" value={userData.apellido}
            onChange={(e) => handleChange({ apellido: e.target.value })}
            className={cls("apellido", errors, !!userData.apellido)} />
          {errors.apellido && <p className={errorClass}>{errors.apellido}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Apodo</label>
        <input type="text" placeholder="La Pulga, El Pichichi, Chucky..." value={userData.apodo}
          onChange={(e) => handleChange({ apodo: e.target.value.toUpperCase() })}
          className={inputClass} />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className={labelClass}>Barrio</label>
          <input type="text" placeholder="Villa Tesei" value={userData.barrio}
            onChange={(e) => handleChange({ barrio: e.target.value })}
            className={cls("barrio", errors, !!userData.barrio)} />
          {errors.barrio && <p className={errorClass}>{errors.barrio}</p>}
        </div>
        <div className="w-24">
          <label className={labelClass}>Año de nac.</label>
          <input type="number" min={1920} max={2020} placeholder="1995" value={userData.nacimiento}
            onChange={(e) => handleChange({ nacimiento: e.target.value })}
            className={cls("nacimiento", errors, !!userData.nacimiento)} />
          {errors.nacimiento && <p className={errorClass}>{errors.nacimiento}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>DNI</label>
        <input type="text" inputMode="numeric" placeholder="12345678" value={userData.dni}
          onChange={(e) => handleChange({ dni: e.target.value.replace(/\D/g, "") })}
          className={cls("dni", errors, !!userData.dni)} />
        {errors.dni && <p className={errorClass}>{errors.dni}</p>}
      </div>

      <div>
        <label className={labelClass}>Camiseta</label>
        <div className="flex gap-2 items-center">
          <select value={userData.club}
            onChange={(e) => handleChange({ club: e.target.value })}
            className={`${cls("club", errors, !!userData.club)} flex-1`}>
            <option value="" disabled>Elegí tu camiseta</option>
            {JERSEYS.map((j) => <option key={j} value={j}>{jerseyLabel(j)}</option>)}
          </select>
          {userData.club && (
            <img
              src={`/templates/camisetas-hur/${encodeURIComponent(userData.club)}`}
              alt="preview camiseta"
              className="h-56 w-auto rounded-lg border border-gray-200 object-contain flex-shrink-0 bg-white"
            />
          )}
        </div>
        {errors.club && <p className={errorClass}>{errors.club}</p>}
      </div>

      <div>
        <label className={labelClass}>Tu foto</label>
        <div className="bg-[#e6f7f7] border border-[#00B5AD]/30 rounded-xl p-3 mb-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <span className="text-[#007a75] font-semibold col-span-2 mb-0.5">Cómo tiene que ser la foto</span>
          <span className="text-gray-700">✅ De frente, mirando al lente</span>
          <span className="text-gray-700">✅ Teléfono vertical</span>
          <span className="text-gray-700">✅ Fondo liso y despejado</span>
          <span className="text-gray-700">✅ Buena iluminación</span>
          <span className="text-gray-700">❌ Sin anteojos de sol</span>
          <span className="text-gray-700">❌ Sin gorras ni sombreros</span>
          <span className="text-gray-700">❌ Sin filtros ni stickers</span>
          <span className="text-gray-700">❌ No foto de una foto</span>
        </div>
        {userData.photoFile ? (
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl h-20 flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${errors.photoFile ? "border-red-400" : "border-gray-300 hover:border-[#00B5AD]"}`}
          >
            <img src={URL.createObjectURL(userData.photoFile)} alt="preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className={`md:hidden flex-1 border-2 border-dashed rounded-xl h-20 flex flex-col items-center justify-center gap-1 transition-colors ${errors.photoFile ? "border-red-400" : "border-gray-300 hover:border-[#00B5AD]"}`}
            >
              <span className="text-xl">📷</span>
              <span className="text-gray-400 text-xs">Cámara</span>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`flex-1 border-2 border-dashed rounded-xl h-20 flex flex-col items-center justify-center gap-1 transition-colors ${errors.photoFile ? "border-red-400" : "border-gray-300 hover:border-[#00B5AD]"}`}
            >
              <span className="text-xl">🖼️</span>
              <span className="text-gray-400 text-xs">Galería</span>
            </button>
          </div>
        )}
        {errors.photoFile && <p className={errorClass}>{errors.photoFile}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleChange({ photoFile: e.target.files?.[0] ?? null })} />
        <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden"
          onChange={(e) => handleChange({ photoFile: e.target.files?.[0] ?? null })} />
      </div>

      <button onClick={handleSubmit}
        className="w-full py-2.5 rounded-xl font-black bg-[#00B5AD] hover:bg-[#008f89] text-white transition-all text-sm">
        Generar mis figuritas ✨
      </button>
    </div>
  );
}
