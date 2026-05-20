import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const testEmails = (process.env.TEST_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  if (testEmails.includes(email.toLowerCase().trim())) {
    return NextResponse.json({ exists: false, alreadyGenerated: false });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Error al verificar el email" }, { status: 500 });
  }

  const user = data as { generated: boolean } | null;
  return NextResponse.json({
    exists: !!user,
    alreadyGenerated: user?.generated ?? false,
  });
}
