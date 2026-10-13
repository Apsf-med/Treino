// GET /api/push/key → chave pública VAPID usada pelo app para se inscrever no push
import { getVapid, json } from "../lib/common.mjs";

export default async () => {
  try {
    const { publicKey } = await getVapid();
    return json({ publicKey });
  } catch (e) {
    console.error("push-key", e);
    return json({ error: "indisponível" }, 500);
  }
};

export const config = { path: "/api/push/key" };
