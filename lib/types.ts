import type { Club } from "./clubs";

export type Step = "email" | "form" | "generating" | "result" | "already-generated";

export interface UserData {
  email: string;
  nombre: string;
  apellido: string;
  apodo: string;
  barrio: string;
  edad: string;
  club: Club | "";
  photoFile: File | null;
}

export interface GeneratedFiguritas {
  seleccion: string;
  club: string;
}

export interface SupabaseUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  apodo: string;
  barrio: string;
  edad: number;
  club: string;
  generated: boolean;
  created_at: string;
}
