import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { supabase } from "@/lib/supabase";
import type { SupabaseUser } from "@/lib/supabase";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

function loadTemplate(filename: string): { data: string; mimeType: string } | null {
  const path = join(process.cwd(), "public", "templates", filename);
  if (!existsSync(path)) return null;
  const buf = readFileSync(path);
  const ext = filename.split(".").pop() ?? "jpg";
  const mimeMap: Record<string, string> = { png: "image/png", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg" };
  return {
    data: buf.toString("base64"),
    mimeType: mimeMap[ext] ?? "image/jpeg",
  };
}

function buildPrompt(params: {
  nombre: string;
  barrio: string;
  club: string;
  edad: number;
  type: "seleccion" | "club";
}): string {
  const { nombre, barrio, club, edad, type } = params;
  const equipo = type === "seleccion" ? "Selección Argentina" : club;
  const nacimiento = new Date().getFullYear() - edad;

  return (
    `Tenés dos imágenes:\n` +
    `- IMAGEN 1: una foto de una persona real.\n` +
    `- IMAGEN 2: un template de figurita Panini con el espacio de la cara VACÍO.\n\n` +
    `Tu tarea: colocá la cabeza de la persona de la IMAGEN 1 en el espacio vacío de la IMAGEN 2. ` +
    `La cabeza debe encajar naturalmente dejando el cuello y la parte superior del pecho visibles — no cortés la imagen a la altura del mentón. ` +
    `El cuello debe conectar naturalmente con el cuello de la camiseta del template. ` +
    `Proporciones realistas: la cabeza no debe verse ni muy grande ni muy chica respecto a la camiseta. ` +
    `Mantené el diseño del template exactamente igual. ` +
    `IMPORTANTE: conservá el tono de piel exacto de la persona de la IMAGEN 1, sin mezclarlo ni teñirlo con los colores del fondo. ` +
    `La piel debe verse natural y realista.\n\n` +
    `NO agregues ningún texto, nombre, ni datos en la imagen. ` +
    `Si el template tiene texto en la parte inferior, dejá esa área con el color de fondo sin texto.`
  );
}

async function generateFigurita(
  photoBase64: string,
  photoMime: string,
  templateData: { data: string; mimeType: string } | null,
  prompt: string
): Promise<string> {
  const parts: object[] = [
    { inlineData: { data: photoBase64, mimeType: photoMime } },
    ...(templateData ? [{ inlineData: { data: templateData.data, mimeType: templateData.mimeType } }] : []),
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const candidates = response.candidates ?? [];
  for (const candidate of candidates) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType ?? "image/png"};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Gemini no devolvió imagen");
}

export async function POST(req: NextRequest) {
  const form     = await req.formData();
  const email    = form.get("email") as string;
  const nombre   = form.get("nombre") as string;
  const apellido = form.get("apellido") as string;
  const apodo    = form.get("apodo") as string;
  const barrio   = form.get("barrio") as string;
  const edad     = Number(form.get("edad"));
  const club     = form.get("club") as string;
  const photo    = form.get("photo") as File;

  if (!email || !nombre || !apellido || !barrio || !club || !photo) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const testEmails = (process.env.TEST_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  const isTestUser = testEmails.includes(email.toLowerCase().trim());

  if (!isTestUser) {
    const { data: existing } = await supabase
      .from("users").select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if ((existing as Pick<SupabaseUser, "generated"> | null)?.generated) {
      return NextResponse.json({ error: "Este email ya generó sus figuritas" }, { status: 409 });
    }
  }

  const photoBuffer = Buffer.from(await photo.arrayBuffer());
  const photoBase64 = photoBuffer.toString("base64");

  const argentinaTemplate =
    loadTemplate("argentina.jpg") ?? loadTemplate("argentina.png") ?? loadTemplate("argentina.webp");
  const clubTemplate =
    loadTemplate("boca.jpg") ?? loadTemplate("boca.png") ?? loadTemplate("boca.webp");

  const displayName = apodo || `${nombre} ${apellido}`;

  let seleccionUrl: string;
  let clubUrl: string;

  try {
    seleccionUrl = await generateFigurita(
      photoBase64, photo.type, argentinaTemplate,
      buildPrompt({ nombre: displayName, barrio, club, edad, type: "seleccion" })
    );
    clubUrl = await generateFigurita(
      photoBase64, photo.type, clubTemplate,
      buildPrompt({ nombre: displayName, barrio, club, edad, type: "club" })
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Gemini error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (!isTestUser) {
    const { error: insertError } = await supabase.from("users").upsert([{
      email: email.toLowerCase().trim(),
      nombre, apellido, apodo, barrio, edad, club, generated: true,
    }]);
    if (insertError) {
      return NextResponse.json({ error: "Error al guardar el usuario" }, { status: 500 });
    }
  }

  return NextResponse.json({ seleccion: seleccionUrl, club: clubUrl });
}
