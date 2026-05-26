import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeTemplate, cropHeadAndNeck, normalizeOutput } from "@/lib/compose";
import { CLUBS_JERSEY_MAP } from "@/lib/clubs";
import type { SupabaseUser } from "@/lib/supabase";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

function loadTemplate(
  filename: string,
): { data: string; mimeType: string } | null {
  const path = join(process.cwd(), "public", "templates", filename);
  if (!existsSync(path)) return null;
  const buf = readFileSync(path);
  const ext = filename.split(".").pop() ?? "jpg";
  const mimeMap: Record<string, string> = {
    png: "image/png",
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };
  return {
    data: buf.toString("base64"),
    mimeType: mimeMap[ext] ?? "image/jpeg",
  };
}

function loadJersey(club: string): { data: string; mimeType: string } | null {
  const jerseyNum = CLUBS_JERSEY_MAP[club] ?? 1;
  return loadTemplate(`camisetas-hur/${jerseyNum}.png`);
}

interface UserParams {
  nombre: string;
  apellido: string;
  apodo: string;
  barrio: string;
  edad: number;
  club: string;
}

function buildPromptArgentina(p: UserParams): string {
  const nacimiento = new Date().getFullYear() - p.edad;
  const nombreCompleto = `${p.nombre} ${p.apellido}`.trim();

  return (
    `Tenés dos imágenes:\n` +
    `- IMAGEN 1: foto de una persona real (cabeza y torso).\n` +
    `- IMAGEN 2: template de figurita del Mundial 2026. Tiene una camiseta celeste de la Selección Argentina ` +
    `SIN cabeza, y una sección de datos en la parte inferior con textos de ejemplo.\n\n` +
    `Tu tarea tiene DOS partes:\n` +
    `PARTE 1 — Agregá la cabeza y el cuello de la persona de IMAGEN 1 sobre la camiseta de IMAGEN 2, ` +
    `como si la persona la estuviera usando. La cabeza va POR ENCIMA y POR DELANTE del cuello de la camiseta — ` +
    `nunca detrás de la tela. La cara debe quedar completamente visible en primer plano.\n` +
    `PARTE 2 — Completá la sección de datos de la parte inferior con estos valores reales:\n` +
    `  · Donde dice "NOMBRE Y APELLIDO" → escribí: ${nombreCompleto}\n` +
    `  · Donde dice "FECHA DE NAC" → escribí: ${nacimiento}\n` +
    `  · Donde dice "BARRIO" → escribí: ${p.barrio}\n` +
    (p.apodo
      ? `  · Donde dice "APODO" → escribí: ${p.apodo}\n`
      : `  · El campo "APODO" dejalo con su color de fondo, sin texto.\n`) +
    `\nReglas OBLIGATORIAS:\n` +
    `- La cabeza debe ser grande y bien proporcionada con la camiseta — como una figurita Panini real.\n` +
    `- NO modifiques la relación de aspecto de la cara — ni la estires, ni la ensanches, ni la aplastes. La cara debe mantener exactamente las proporciones del rostro original.\n` +
    `- Para centrar la cabeza, usá el escudo de la FIFA y las rayas del cuello de la camiseta como referencia: la cabeza debe quedar alineada sobre esas rayas, centrada respecto al escudo.\n` +
    `- Conservá el tono de piel EXACTO de la persona, sin teñirlo con ningún color del fondo.\n` +
    `- NO modifiques ningún rasgo facial: ni la barba, ni el cabello, ni los ojos, ni la forma de la cara. La cara debe ser idéntica a IMAGEN 1.\n` +
    `- Usá el mismo estilo tipográfico del template para los datos (mismo color, mismo tamaño).\n` +
    `- CRÍTICO: los colores del fondo (teal, los números "26" decorativos) deben quedar EXACTAMENTE iguales al template — no los oscurezcas ni los cambies.\n` +
    `- NO modifiques nada más: logos, diseño del template.`
  );
}

function buildPromptHurlingham(p: UserParams): string {
  const nacimiento = new Date().getFullYear() - p.edad;
  const nombreCompleto = `${p.nombre} ${p.apellido}`.trim();

  return (
    `Tenés tres imágenes:\n` +
    `- IMAGEN 1: foto de una persona real (cabeza y torso).\n` +
    `- IMAGEN 2: camiseta de fútbol del club "${p.club}".\n` +
    `- IMAGEN 3: template de figurita del Mundial 2026 para clubes de Hurlingham. ` +
    `Tiene un espacio blanco grande con forma orgánica/redondeada en el centro ` +
    `y una sección de datos en la parte inferior con textos de ejemplo en gris.\n\n` +
    `Tu tarea tiene DOS partes:\n` +
    `PARTE 1 — Dentro del espacio blanco de IMAGEN 3, mostrá a la persona de IMAGEN 1 ` +
    `vistiendo la camiseta de IMAGEN 2. Encuadre tipo retrato: visible solo la cabeza, el cuello y los hombros — ` +
    `como una foto de documento o carnet. La imagen se corta a la altura de los hombros, no se ve el torso ni los brazos.\n` +
    `PARTE 2 — Completá la sección de datos de la parte inferior con estos valores reales:\n` +
    `  · Donde dice "NOMBRE Y APELLIDO" → escribí: ${nombreCompleto}\n` +
    `  · Donde dice "FECHA DE NAC" → escribí: ${nacimiento}\n` +
    `  · Donde dice "BARRIO" → escribí: ${p.barrio}\n` +
    `  · Donde dice "EQUIPO DONDE JUEGA" → escribí: ${p.club}\n` +
    `\nReglas OBLIGATORIAS:\n` +
    `- La figura (cabeza + torso) debe quedar DENTRO del espacio blanco orgánico, centrada, integrada naturalmente — sin bordes de recorte ni halos blancos visibles alrededor de la figura.\n` +
    `- La figura debe llenar bien el espacio blanco: que sea grande, no pequeña ni flotando.\n` +
    `- Vestí a la persona con la camiseta EXACTA de IMAGEN 2: respetá colores, escudo y diseño.\n` +
    `- Conservá el tono de piel EXACTO de la persona de IMAGEN 1.\n` +
    `- NO modifiques ningún rasgo facial: ni la barba, ni el cabello, ni los ojos, ni la forma de la cara. La cara debe ser idéntica a IMAGEN 1.\n` +
    `- La postura: erguida, mirando al frente. Solo se ve cabeza, cuello y hombros — corte a la altura de los hombros.\n` +
    `- Usá el mismo estilo tipográfico del template para los datos (mismo color, mismo tamaño).\n` +
    `- CRÍTICO: los colores del fondo (teal, los números "26" decorativos, las letras HUR) deben quedar EXACTAMENTE iguales al template.\n` +
    `- NO modifiques nada más del template: logos FIFA, diseño general.`
  );
}

async function generateFigurita(
  photoBase64: string,
  photoMime: string,
  templates: Array<{ data: string; mimeType: string }>,
  prompt: string,
): Promise<string> {
  const parts: object[] = [
    { inlineData: { data: photoBase64, mimeType: photoMime } },
    ...templates.map((t) => ({
      inlineData: { data: t.data, mimeType: t.mimeType },
    })),
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
  const form = await req.formData();
  const email = form.get("email") as string;
  const nombre = form.get("nombre") as string;
  const apellido = form.get("apellido") as string;
  const apodo = form.get("apodo") as string;
  const barrio = form.get("barrio") as string;
  const edad = Number(form.get("edad"));
  const club = form.get("club") as string;
  const photo = form.get("photo") as File;

  if (!email || !nombre || !apellido || !barrio || !club || !photo) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const testEmails = (process.env.TEST_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const isTestUser = testEmails.includes(email.toLowerCase().trim());

  if (!isTestUser) {
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if ((existing as Pick<SupabaseUser, "generated"> | null)?.generated) {
      return NextResponse.json(
        { error: "Este email ya generó sus figuritas" },
        { status: 409 },
      );
    }
  }

  const photoBuffer = Buffer.from(await photo.arrayBuffer());

  // Pre-procesar: normalizar foto y templates
  const argentinaRaw = loadTemplate("argentina.png");
  const hurlinghamRaw = loadTemplate("hurlingham.png");
  const jerseyRaw = loadJersey(club);

  const processedPhoto = await cropHeadAndNeck(photoBuffer);

  const [argentinaTemplate, hurlinghamTemplate] = await Promise.all([
    argentinaRaw
      ? normalizeTemplate(Buffer.from(argentinaRaw.data, "base64"))
      : Promise.resolve(null),
    hurlinghamRaw
      ? normalizeTemplate(Buffer.from(hurlinghamRaw.data, "base64"))
      : Promise.resolve(null),
  ]);

  const userParams: UserParams = { nombre, apellido, apodo, barrio, edad, club };

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: object) =>
        controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));

      let seleccionUrl: string;
      let clubUrl: string;

      try {
        seleccionUrl = await normalizeOutput(
          await generateFigurita(
            processedPhoto.data,
            processedPhoto.mimeType,
            argentinaTemplate ? [argentinaTemplate] : [],
            buildPromptArgentina(userParams),
          ),
        );
        emit({ type: "seleccion", url: seleccionUrl });

        const clubTemplates = [
          ...(jerseyRaw ? [jerseyRaw] : []),
          ...(hurlinghamTemplate ? [hurlinghamTemplate] : []),
        ];
        clubUrl = await normalizeOutput(
          await generateFigurita(
            processedPhoto.data,
            processedPhoto.mimeType,
            clubTemplates,
            buildPromptHurlingham(userParams),
          ),
        );
        emit({ type: "club", url: clubUrl });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Gemini error:", msg);
        emit({ type: "error", message: msg });
        controller.close();
        return;
      }

      if (!isTestUser) {
        const emailSlug = email
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, "_");

        const uploadImage = async (
          dataUrl: string,
          name: string,
        ): Promise<string | null> => {
          const [meta, base64] = dataUrl.split(",");
          const mimeType = meta.split(":")[1].split(";")[0];
          const ext = mimeType.split("/")[1];
          const buffer = Buffer.from(base64, "base64");
          const path = `${emailSlug}/${name}.${ext}`;
          const { error } = await supabaseAdmin.storage
            .from("figuritas")
            .upload(path, buffer, { contentType: mimeType, upsert: true });
          if (error) {
            console.error("Storage upload error:", error.message);
            return null;
          }
          return supabaseAdmin.storage.from("figuritas").getPublicUrl(path)
            .data.publicUrl;
        };

        let seleccionStoredUrl: string | null = null;
        let clubStoredUrl: string | null = null;
        try {
          [seleccionStoredUrl, clubStoredUrl] = await Promise.all([
            uploadImage(seleccionUrl, "seleccion"),
            uploadImage(clubUrl, "club"),
          ]);
        } catch (storageErr) {
          console.error("Storage upload failed:", storageErr);
        }

        const { error: insertError } = await supabaseAdmin
          .from("users")
          .upsert(
            [
              {
                email: email.toLowerCase().trim(),
                nombre,
                apellido,
                apodo,
                barrio,
                edad,
                club,
                generated: true,
                figurita_seleccion_url: seleccionStoredUrl,
                figurita_club_url: clubStoredUrl,
                generated_at: new Date().toISOString(),
              },
            ],
            { onConflict: "email" },
          );
        if (insertError) {
          console.error("Supabase upsert error:", insertError);
        }
      }

      emit({ type: "done" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
