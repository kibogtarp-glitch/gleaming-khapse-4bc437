// Lit les données du site depuis Netlify Blobs (stockage clé/valeur intégré à Netlify).
const { connectLambda, getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  try {
    connectLambda(event);
    const store = getStore("onelife");
    const data = await store.get("sitedata", { type: "json" });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(data || null)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "server_error" }) };
  }
};
