export const CLUBS_HURLINGHAM = [
  "Club Atlético Hurlingham",
  "Hurlingham Club",
  "Club Social y Deportivo El Triángulo",
  "Club Atlético Villa del Parque",
  "Club Deportivo Palermo",
  // TODO: reemplazar con los clubes reales de Hurlingham
] as const;

export type Club = (typeof CLUBS_HURLINGHAM)[number];
