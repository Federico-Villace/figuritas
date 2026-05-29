export type Step = "email" | "form" | "generating" | "result" | "already-generated";

export interface UserData {
  email: string;
  nombre: string;
  apellido: string;
  apodo: string;
  barrio: string;
  nacimiento: string;
  dni: string;
  club: string;
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
  nacimiento: number;
  dni: string | null;
  club: string;
  generated: boolean;
  created_at: string;
  figurita_seleccion_url: string | null;
  figurita_club_url: string | null;
  generated_at: string | null;
}
