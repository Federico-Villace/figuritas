import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { SupabaseUser } from "@/lib/types";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const testEmails = (process.env.TEST_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  if (testEmails.includes(email.toLowerCase().trim())) {
    return NextResponse.json({ exists: false, alreadyGenerated: false, figuritas: null });
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Error al verificar el email" }, { status: 500 });
  }

  const user = data as SupabaseUser | null;

  let figuritas: { seleccion: string; club: string } | null = null;
  if (
    user?.generated &&
    user.figurita_seleccion_url &&
    user.figurita_club_url &&
    user.generated_at &&
    Date.now() - new Date(user.generated_at).getTime() < FIFTEEN_DAYS_MS
  ) {
    figuritas = {
      seleccion: user.figurita_seleccion_url,
      club: user.figurita_club_url,
    };
  }

  return NextResponse.json({
    exists: !!user,
    alreadyGenerated: user?.generated ?? false,
    figuritas,
  });
}
