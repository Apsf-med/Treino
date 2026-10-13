// GET  /api/sync?id=CODIGO → baixa o backup
// PUT  /api/sync {id, data} → salva o backup (progresso, cargas, histórico, configurações)
import { syncStore, json, validId } from "../lib/common.mjs";

const MAX_BYTES = 900 * 1024;

export default async (req) => {
  const st = syncStore();
  try {
    if (req.method === "GET") {
      const id = new URL(req.url).searchParams.get("id");
      if (!validId(id)) return json({ error: "código inválido" }, 400);
      const data = await st.get(`s:${id}`, { type: "json" });
      if (!data) return json({ error: "não encontrado" }, 404);
      return json({ data });
    }
    if (req.method === "PUT" || req.method === "POST") {
      const text = await req.text();
      if (text.length > MAX_BYTES) return json({ error: "backup grande demais" }, 413);
      let b;
      try { b = JSON.parse(text); } catch { return json({ error: "JSON inválido" }, 400); }
      if (!validId(b.id) || !b.data || typeof b.data !== "object") return json({ error: "dados inválidos" }, 400);
      await st.setJSON(`s:${b.id}`, { ...b.data, savedAt: Date.now() });
      return json({ ok: true });
    }
    return json({ error: "método não suportado" }, 405);
  } catch (e) {
    console.error("sync", e);
    return json({ error: "falha no servidor" }, 500);
  }
};

export const config = { path: "/api/sync" };
