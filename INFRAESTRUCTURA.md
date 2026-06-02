# Infraestructura y Costos — Figuritas Hurlingham 2026

---

## Costo de IA por usuario

Cada usuario genera **2 figuritas** → 2 llamadas a Gemini con generación de imagen.

### Modelo: `gemini-3.1-flash-image-preview`

| Concepto | Por llamada | Por usuario (×2) |
|---|---|---|
| Input tokens (foto + camiseta + template + prompt) | ~$0.002 | ~$0.004 |
| Output: imagen generada | ~$0.040 | ~$0.080 |
| **Total estimado** | **~$0.042** | **~$0.084** |

> Verificar precio actualizado en: https://ai.google.dev/gemini-api/docs/pricing

---

## Servicios y costos mensuales

### Vercel (deploy Next.js)

| Plan | Precio | ¿Funciona? |
|---|---|---|
| Hobby (Free) | $0 | ✅ SÍ — el streaming mantiene la conexión abierta |
| Pro | $20/mes | ✅ SÍ |

> El streaming evita el timeout de 10s del plan Hobby. Confirmado en producción.
> Si se alcanzan los límites de ancho de banda o requests del plan gratuito, migrar a Pro ($20/mes).

---

### Supabase (base de datos + storage de imágenes)

Cada usuario genera 2 imágenes PNG de ~3MB cada una → **~6MB por usuario**.

| Plan | Precio | Storage incluido | Usuarios estimados |
|---|---|---|---|
| Free | $0 | 1 GB | ~160 usuarios |
| Pro | $25/mes | 100 GB | ~16.000 usuarios |

> Con el plan Free alcanzaría para un evento pequeño de prueba (~150 personas). Para cualquier evento real se necesita Pro.

---

### Resend (envío de emails)

| Plan | Precio | Emails incluidos | Límite diario |
|---|---|---|---|
| Free | $0 | 3.000/mes | 100/día |
| Pro | $20/mes | 50.000/mes | Sin límite diario |

> Para un evento de 1.000 personas repartido en varios días, el plan Free alcanza. Si el evento es en un solo día, se necesita Pro.

---

## Resumen: costo para 1.000 usuarios

### Con Vercel Pro

| Servicio | Costo mensual |
|---|---|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Gemini (1.000 × $0.084) | $84 |
| Resend Free | $0 |
| **Total** | **~$129** |

### Con Railway (alternativa más económica)

| Servicio | Costo mensual |
|---|---|
| Railway | $8 |
| Supabase Pro | $25 |
| Gemini (1.000 × $0.084) | $84 |
| Resend Free | $0 |
| **Total** | **~$117** |

---

## ¿Cuántos usuarios salen con $500?

### Con Vercel Pro + Supabase Pro (fijo: $45/mes)

| Concepto | Valor |
|---|---|
| Presupuesto total | $500 |
| Costo fijo (1 mes) | -$45 |
| Disponible para Gemini | $455 |
| Costo por usuario (Gemini) | $0.084 |
| **Usuarios estimados** | **~5.400** |

### Con Railway + Supabase Pro (fijo: $33/mes)

| Concepto | Valor |
|---|---|
| Presupuesto total | $500 |
| Costo fijo (1 mes) | -$33 |
| Disponible para Gemini | $467 |
| Costo por usuario (Gemini) | $0.084 |
| **Usuarios estimados** | **~5.500** |

---

## Recomendación

Para un evento de Hurlingham con presupuesto acotado:

| Opción | Costo fijo/mes | Costo por usuario | Recomendado para |
|---|---|---|---|
| Railway + Supabase Free | ~$8 | $0.084 | Pruebas / <150 personas |
| Railway + Supabase Pro | ~$33 | $0.084 | Eventos de hasta 5.000 personas |
| Vercel Pro + Supabase Pro | ~$45 | $0.084 | Si ya usás Vercel para otros proyectos |

**La variable que más impacta es Gemini** — representa el 70% del costo total a escala. Los servicios de infraestructura son fijos y relativamente baratos.

---

## Plataformas necesarias (checklist)

- [ ] **Google Account** — para Google AI Studio y GitHub
- [ ] **Google AI Studio** → API Key para `GOOGLE_AI_API_KEY` + billing activado
- [ ] **GitHub** → repositorio del código
- [ ] **Supabase** → nueva instancia (no personal) + migrar DB + bucket `figuritas`
- [ ] **Vercel Pro** o **Railway** → deploy de la app
- [ ] **Resend** → API Key para `RESEND_API_KEY` + verificar dominio para producción

### Variables de entorno necesarias

```
GOOGLE_AI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
TEST_EMAILS
```
