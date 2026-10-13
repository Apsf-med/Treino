// Utilidades compartilhadas pelas funções do backend de notificações.
import webpush from "web-push";
import { getStore } from "@netlify/blobs";

// "strong" garante que o cancelamento/reagendamento seja visto imediatamente pela função em segundo plano
export const timers = () => getStore({ name: "treino-push", consistency: "strong" });
export const configStore = () => getStore({ name: "treino-config", consistency: "strong" });
export const syncStore = () => getStore({ name: "treino-sync", consistency: "strong" });

export const MAX_DELAY_MS = 14 * 60 * 1000; // background functions duram no máximo 15 min

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export const validId = (s) => typeof s === "string" && /^[A-Za-z0-9-]{8,80}$/.test(s);

export function validSub(sub) {
  return sub && typeof sub.endpoint === "string" && /^https:\/\//.test(sub.endpoint) &&
    sub.endpoint.length < 1024 && sub.keys && typeof sub.keys.p256dh === "string" && typeof sub.keys.auth === "string";
}

// Chaves VAPID: usa variáveis de ambiente se existirem; senão gera uma vez e guarda no Netlify Blobs.
export async function getVapid() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
  }
  const st = configStore();
  let keys = await st.get("vapid", { type: "json" });
  if (!keys) {
    const fresh = webpush.generateVAPIDKeys();
    await st.setJSON("vapid", fresh, { onlyIfNew: true }); // evita corrida entre duas instâncias
    keys = (await st.get("vapid", { type: "json" })) || fresh;
  }
  return keys;
}

export function vapidSubject(req) {
  if (process.env.VAPID_SUBJECT) return process.env.VAPID_SUBJECT; // ex.: mailto:voce@email.com
  const site = process.env.URL || (req && new URL(req.url).origin) || "https://example.com";
  return site.startsWith("https://") ? site : "mailto:admin@example.com";
}

export const clip = (s, n) => String(s == null ? "" : s).slice(0, n);
