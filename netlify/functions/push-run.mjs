// Background function: espera até o horário de término e envia o push.
// Nunca lança erro (o Netlify repete invocações com erro, o que poderia duplicar o aviso).
import webpush from "web-push";
import { timers, getVapid, vapidSubject, MAX_DELAY_MS } from "../lib/common.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  let device, version;
  try { ({ device, version } = await req.json()); } catch { return; }
  if (!device || !version) return;
  const st = timers();
  const key = `t:${device}`;
  try {
    let t = await st.get(key, { type: "json" });
    if (!t || t.version !== version) return; // já substituído/cancelado
    const wait = Math.min(t.endAt - Date.now(), MAX_DELAY_MS);
    if (wait > 0) await sleep(wait);

    t = await st.get(key, { type: "json" });
    if (!t || t.version !== version) return; // pausado, pulado ou reagendado enquanto esperava

    const { publicKey, privateKey } = await getVapid();
    webpush.setVapidDetails(vapidSubject(req), publicKey, privateKey);
    const payload = JSON.stringify({ title: t.title, body: t.body, url: t.url, tag: "descanso", ts: t.endAt });
    await webpush.sendNotification(t.sub, payload, { TTL: 120, urgency: "high", topic: "descanso" });
    await st.delete(key);
  } catch (e) {
    const code = e && e.statusCode;
    if (code === 404 || code === 410) { try { await st.delete(key); } catch {} } // inscrição expirada
    console.error("push-run", code || "", e && e.body ? e.body : e);
  }
};

export const config = { path: "/api/push/run", background: true };
