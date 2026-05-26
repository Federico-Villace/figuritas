import sharp from "sharp";

// Dimensiones estándar para todos los templates
const TEMPLATE_W = 900;
const TEMPLATE_H = 1260;

export async function normalizeTemplate(buffer: Buffer): Promise<{ data: string; mimeType: string }> {
  const normalized = await sharp(buffer)
    .resize(TEMPLATE_W, TEMPLATE_H, { fit: "fill" })
    .jpeg({ quality: 95 })
    .toBuffer();
  return { data: normalized.toString("base64"), mimeType: "image/jpeg" };
}

// Recorta la foto del usuario al área de cabeza+cuello (top 65%)
// Así la IA sabe exactamente qué tiene que colocar y dónde termina
export async function cropHeadAndNeck(buffer: Buffer): Promise<{ data: string; mimeType: string }> {
  const resized = await sharp(buffer)
    .rotate() // aplica rotación EXIF automáticamente
    .resize(600, 800, { fit: "cover", position: "attention" }) // centra en la región más relevante (cara)
    .jpeg({ quality: 95 })
    .toBuffer();

  return { data: resized.toString("base64"), mimeType: "image/jpeg" };
}
