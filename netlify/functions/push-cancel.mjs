// POST /api/push/cancel → cancela o push pendente deste aparelho (pausa, pular, fim do treino)
import { timers, json, validId } from "../lib/common.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "use POST" }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  if (!validId(b && b.device)) return json({ error: "device inválido" }, 400);
  try {
    await timers().delete(`t:${b.device}`);
    return json({ ok: true });
  } catch (e) {
    console.error("push-cancel", e);
    return json({ error: "falha ao cancelar" }, 500);
  }
};

export const config = { path: "/api/push/cancel" };
