export const JERSEYS = [
  "Ateneo Roca - Arquera - Fem.png",
  "Ateneo Roca - Arquero- Masc.png",
  "Ateneo Roca - Jugador - Masc.png",
  "Ateneo Roca - Jugadora - Fem.png",
  "Bajo Belgrano - Arquero.png",
  "Bajo Belgrano - Jugador.png",
  "Belgrano Blanco - Arquera - Fem.png",
  "Belgrano Blanco - Jugadora - Fem.png",
  "Belgrano Rojo - arquero - Femenino.png",
  "Belgrano Rojo - Jugadora - Fem.png",
  "Buen Ayre - Arquero.png",
  "Buen Ayre - Jugador.png",
  "Buen Camino - Arquero.png",
  "Buen Camino - Jugador.png",
  "CA San Damian - Arquero.png",
  "CA San Damian - Jugador.png",
  "CFI - Arquero.png",
  "CFI - Jugador.png",
  "Cartero - Arquero.png",
  "Cartero - Jugador.png",
  "Cb 12 de Octubre - Arquera - Fem.png",
  "Cb 12 de Octubre - Arquero - Masc.png",
  "Cb 12 de Octubre - Jugador - Masc.png",
  "Cb 12 de Octubre - Jugadora - Fem.png",
  "Ciclon - Arquero.png",
  "Ciclon - Jugador.png",
  "Cristo Rey - Arquero.png",
  "Cristo Rey - Jugador.png",
  "Deportivo San Martin - Arquera - Fem.png",
  "Deportivo San Martin - Arquero - Masc.png",
  "Deportivo San Martin - Jugador - Masc.png",
  "Deportivo San Martin - Jugadora - Fem.png",
  "Destino y Destino Metro - Arquero.png",
  "Destino y Destino Metro - Jugador.png",
  "EIDU - Arquera.png",
  "EIDU - Arquero.png",
  "EIDU - Jugador.png",
  "EIDU - Jugadora.png",
  "Greppi - Jugador.png",
  "Hurlingham FC - Arquero.png",
  "Hurlingham FC - Jugador.png",
  "Hurlingham Norte - Arquero.png",
  "Hurlingham Norte - Jugador.png",
  "Juventud Mitre - Arquera - Fem.png",
  "Juventud Mitre - Arquero - Masc.png",
  "Juventud Mitre - Jugador - Masc.png",
  "Juventud Mitre - Jugadora - Fem.png",
  "La Esperanza - Arquero.png",
  "La Esperanza - Jugador.png",
  "La Juanita_Malvinas - Arquera - Fem.png",
  "La Juanita_Malvinas - Arquero - Masc.png",
  "La Juanita_Malvinas - Jugador - Masc.png",
  "La Juanita_Malvinas - Jugadora - Fem.png",
  "Libertador - Arquero.png",
  "Libertador - Jugador.png",
  "Los Patitos modelo.png",
  "Pampero - Arquero.png",
  "Pampero - Jugador.png",
  "Patitos - Arquero.png",
  "Patitos - Jugador.png",
  "Plaza Urquiza - Jugador.png",
  "Quinta Los Pibes - Arquero.png",
  "Quinta Los Pibes - Jugador.png",
  "SF 18 de Julio_18 de Julio C - Arquero.png",
  "SF 18 de Julio_18 de Julio C - Jugador.png",
  "SF Primero de Mayo - Arquero.png",
  "SF Primero de Mayo - Jugador.png",
  "SF San Damian - Arquera - Fem.png",
  "SF San Damian - Arquero - Masc.png",
  "SF San Damian - Jugador - Masc.png",
  "SF San Damian - Jugadora - Fem.png",
  "Santa Leonor - Arquera - Fem.png",
  "Santa Leonor - Arquero - Masc.png",
  "Santa Leonor - Jugador - Masc.png",
  "Santa Leonor - Jugadora - Fem.png",
  "Tinta - Arquero.png",
  "Tinta - Jugador.png",
  "Villa Club - Arquero.png",
  "Villa Club - Jugador.png",
] as const;

export type Jersey = (typeof JERSEYS)[number];

export function jerseyLabel(filename: Jersey | string): string {
  return filename
    .replace(/\.png$/i, "")
    .replace(/\s*-\s*/g, " - ")
    .trim();
}

export function clubNameFromJersey(filename: Jersey | string): string {
  const withoutExt = filename.replace(/\.png$/i, "");
  const dashIndex = withoutExt.indexOf(" - ");
  if (dashIndex !== -1) {
    return withoutExt.substring(0, dashIndex).trim();
  }
  return withoutExt.trim();
}
