import sharp from "sharp";

const W = 300;
const H = 420;
const FACE_HEIGHT = 200; // px que ocupa la cabeza/cara

function jerseyArgentinaSvg(): string {
  // Franjas celeste y blanco verticales — 6 franjas de 50px
  const stripes = Array.from({ length: 6 }, (_, i) =>
    `<rect x="${i * 50}" y="${FACE_HEIGHT}" width="50" height="${H - FACE_HEIGHT}" fill="${i % 2 === 0 ? "#75AADB" : "#FFFFFF"}"/>`
  ).join("");

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${stripes}

    <!-- Cuello V -->
    <polygon
      points="${W / 2 - 22},${FACE_HEIGHT} ${W / 2},${FACE_HEIGHT + 45} ${W / 2 + 22},${FACE_HEIGHT}"
      fill="#1a3a6b"
    />

    <!-- Borde cuello -->
    <polyline
      points="${W / 2 - 22},${FACE_HEIGHT} ${W / 2},${FACE_HEIGHT + 45} ${W / 2 + 22},${FACE_HEIGHT}"
      fill="none" stroke="#0d2550" stroke-width="3"
    />

    <!-- Badge AFA (placeholder circular) -->
    <circle cx="88" cy="${FACE_HEIGHT + 65}" r="22" fill="#1a3a6b"/>
    <circle cx="88" cy="${FACE_HEIGHT + 65}" r="18" fill="none" stroke="#C9A84C" stroke-width="2"/>
    <text x="88" y="${FACE_HEIGHT + 62}" text-anchor="middle" fill="#C9A84C"
      font-size="9" font-weight="bold" font-family="Arial">AFA</text>
    <text x="88" y="${FACE_HEIGHT + 74}" text-anchor="middle" fill="#C9A84C"
      font-size="7" font-family="Arial">ARG</text>

    <!-- Gradiente de transición cara → jersey (fade) -->
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="60%" stop-color="transparent"/>
        <stop offset="100%" stop-color="transparent"/>
      </linearGradient>
    </defs>
  </svg>`;
}

function jerseyClubSvg(): string {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Camiseta verde sólida -->
    <rect x="0" y="${FACE_HEIGHT}" width="${W}" height="${H - FACE_HEIGHT}" fill="#1a4a2e"/>

    <!-- Cuello redondo -->
    <ellipse cx="${W / 2}" cy="${FACE_HEIGHT}" rx="28" ry="14" fill="#0f2d1b"/>

    <!-- Franja horizontal blanca (pecho) -->
    <rect x="0" y="${FACE_HEIGHT + 50}" width="${W}" height="18" fill="rgba(255,255,255,0.15)"/>

    <!-- Badge club (placeholder) -->
    <circle cx="88" cy="${FACE_HEIGHT + 75}" r="22" fill="#0f2d1b"/>
    <circle cx="88" cy="${FACE_HEIGHT + 75}" r="18" fill="none" stroke="#ffffff" stroke-width="1.5"/>
    <text x="88" y="${FACE_HEIGHT + 72}" text-anchor="middle" fill="white"
      font-size="8" font-weight="bold" font-family="Arial">HUR</text>
    <text x="88" y="${FACE_HEIGHT + 83}" text-anchor="middle" fill="white"
      font-size="7" font-family="Arial">2026</text>
  </svg>`;
}

export async function composeCard(
  photoBuffer: Buffer,
  type: "seleccion" | "club"
): Promise<string> {
  // 1. Redimensionar foto: 300px de ancho, recortar desde arriba (cara primero)
  const resizedFace = await sharp(photoBuffer)
    .resize(W, H, { fit: "cover", position: "top" })
    .toBuffer();

  // 2. Generar SVG del jersey
  const jerseySvg = Buffer.from(type === "seleccion" ? jerseyArgentinaSvg() : jerseyClubSvg());

  // 3. Componer: foto base + jersey encima
  const composed = await sharp(resizedFace)
    .composite([{ input: jerseySvg, top: 0, left: 0 }])
    .png()
    .toBuffer();

  return `data:image/png;base64,${composed.toString("base64")}`;
}
