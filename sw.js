/* Service Worker — Plano de Treino (PWA)
   - cache do app para abrir offline
   - recebe push do servidor e mostra a notificação de fim de descanso
   - ao tocar na notificação, abre/foca o app */
const VERSION = "treino-v3.0.0";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/badge-96.png"];
const CDN = ["https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    // CDN é opcional: se falhar, o app ainda instala (3D fica indisponível offline)
    await Promise.all(CDN.map((u) => cache.add(new Request(u, { mode: "cors" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) return; // backend: sempre rede

  // Navegação: rede primeiro (pega atualizações), cache como reserva offline
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(VERSION);
        cache.put("/index.html", res.clone());
        return res;
      } catch (e) {
        return (await caches.match("/index.html")) || (await caches.match("/")) || Response.error();
      }
    })());
    return;
  }

  // Estáticos e CDN (three.js, fontes): cache primeiro, atualiza em segundo plano
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(async (res) => {
      if (res && (res.ok || res.type === "opaque")) {
        const cache = await caches.open(VERSION);
        cache.put(req, res.clone());
      }
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});

/* ---------- PUSH ---------- */
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data && event.data.text() }; }
  const title = data.title || "Descanso finalizado! Hora da próxima série. 💪";
  const options = {
    body: data.body || "Volte ao treino.",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    tag: data.tag || "descanso",
    renotify: true,
    vibrate: [250, 120, 250],
    timestamp: data.ts || Date.now(),
    data: { url: data.url || "/" },
  };
  event.waitUntil((async () => {
    // iOS/Chrome exigem que todo push mostre uma notificação visível
    await self.registration.showNotification(title, options);
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    wins.forEach((c) => c.postMessage({ type: "push", data }));
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of wins) {
      if (new URL(c.url).origin === location.origin) { await c.focus(); return; }
    }
    await self.clients.openWindow(target);
  })());
});

// Se o navegador trocar a inscrição de push, avisa o app ao reabrir (ele se reinscreve ao ativar)
self.addEventListener("pushsubscriptionchange", () => {});
