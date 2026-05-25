export const CLUBS_HURLINGHAM = [
  "Club Atlético Hurlingham",
  "Hurlingham Club",
  "Club Social y Deportivo El Triángulo",
  "Club Atlético Villa del Parque",
  "Club Deportivo Palermo",
  // TODO: reemplazar con los clubes reales de Hurlingham
] as const;

export type Club = (typeof CLUBS_HURLINGHAM)[number];

// Mapeo club → número de archivo en public/templates/camisetas-hur/
// TODO: completar con los números correctos para cada club
export const CLUBS_JERSEY_MAP: Record<string, number> = {
  "Club Atlético Hurlingham": 1,
  "Hurlingham Club": 2,
  "Club Social y Deportivo El Triángulo": 3,
  "Club Atlético Villa del Parque": 4,
  "Club Deportivo Palermo": 5,
};
