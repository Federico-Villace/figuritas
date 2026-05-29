export async function sendFiguritasEmail({
  to,
  nombre,
  seleccionUrl,
  clubUrl,
  club,
}: {
  to: string;
  nombre: string;
  seleccionUrl: string | null;
  clubUrl: string | null;
  club: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY no configurada, se omite el envío de email.");
    return;
  }

  const downloadSection =
    seleccionUrl && clubUrl
      ? `
        <div style="margin: 24px 0; display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="${seleccionUrl}" style="display:inline-block; background:#00B5AD; color:white; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:bold;">
            Descargar Figurita Selección
          </a>
          <a href="${clubUrl}" style="display:inline-block; background:#00B5AD; color:white; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:bold;">
            Descargar Figurita ${club}
          </a>
        </div>
      `
      : `<p style="color:#555;">Ingresá tu email en la app para volver a verlas y descargarlas.</p>`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background:#f0fafa; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fafa; padding: 32px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:white; border-radius:20px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:#00B5AD; padding: 28px 32px; text-align:center;">
                  <h1 style="margin:0; color:white; font-size:22px; font-weight:900; letter-spacing:-0.5px;">
                    ¡Tus figuritas están listas! 🎴
                  </h1>
                  <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:13px;">
                    Figuritas Hurlingham — Mundial 2026
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px 32px;">
                  <p style="margin:0 0 12px; color:#222; font-size:16px;">
                    ¡Hola, <strong>${nombre}</strong>!
                  </p>
                  <p style="margin:0 0 20px; color:#444; font-size:14px; line-height:1.6;">
                    Tu figurita del Mundial 2026 ya está generada. Tenés <strong>15 días</strong> para descargarla desde la app o usando los botones de abajo.
                  </p>
                  ${downloadSection}
                  <hr style="border:none; border-top:1px solid #eee; margin: 24px 0;" />
                  <p style="margin:0; color:#888; font-size:12px; text-align:center;">
                    Si no podés descargar ahora, ingresá tu email en la app y las vas a encontrar disponibles por 15 días más.<br/><br/>
                    <strong style="color:#00B5AD;">Hurlingham Municipio</strong> — #FiguitasHurlingham
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Figuritas Hurlingham <onboarding@resend.dev>",
        to,
        subject: "¡Tus figuritas del Mundial 2026 están listas! 🎴",
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
    }
  } catch (err) {
    console.error("Error enviando email:", err);
  }
}
