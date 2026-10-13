// POST /api/push/schedule → registra o horário absoluto de término do descanso e dispara
// uma background function que dorme até esse horário e envia o push.
// Cada novo agendamento recebe uma "version": se o usuário pausar, pular ou somar tempo,
// a versão antiga deixa de valer e a função antiga termina sem enviar nada.
import { timers, json, validId, validSub, clip, MAX_DELAY_MS } from "../lib/common.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "use POST" }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  const { device, sub, endAt } = b || {};
  if (!validId(device)) return json({ error: "device inválido" }, 400);
  if (!validSub(sub)) return json({ error: "inscrição de push inválida" }, 400);
  const delay = Number(endAt) - Date.now();
  if (!Number.isFinite(delay) || delay < -10000) return json({ error: "horário já passou" }, 400);
  if (delay > MAX_DELAY_MS) return json({ error: "descanso longo demais (máx. 14 min)" }, 400);

  const version = crypto.randomUUID();
  const state = {
    version, endAt: Number(endAt), sub,
    title: clip(b.title || "Descanso finalizado! Hora da próxima série. 💪", 120),
    body: clip(b.body || "Volte ao treino.", 200),
    url: clip(b.url || "/", 200),
    createdAt: Date.now(),
  };
  try {
    await timers().setJSON(`t:${device}`, state);
    // Dispara a background function (responde 202 na hora e continua rodando por até 15 min)
    const run = await fetch(new URL("/api/push/run", req.url), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ device, version }),
    });
    if (run.status !== 202 && !run.ok) throw new Error("run HTTP " + run.status);
    return json({ ok: true, version, endAt: state.endAt });
  } catch (e) {
    console.error("push-schedule", e);
    return json({ error: "falha ao agendar" }, 500);
  }
};

export const config = { path: "/api/push/schedule" };
