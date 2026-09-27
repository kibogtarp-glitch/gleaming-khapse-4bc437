// Écrit les données du site dans Netlify Blobs.
// Protégé par la variable d'environnement SAVE_SECRET (Site settings > Environment variables sur Netlify).
// Cette clé n'est JAMAIS envoyée au navigateur dans le HTML — seule la personne qui la connaît
// peut l'entrer une fois dans l'admin (elle est alors gardée dans le localStorage de son navigateur).
const { connectLambda, getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "method_not_allowed" }) };
  }

  const provided = event.headers["x-admin-secret"] || event.headers["X-Admin-Secret"];
  const expected = process.env.SAVE_SECRET;

  if (!expected || !provided || provided !== expected) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: "unauthorized" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "invalid_json" }) };
  }

  try {
    connectLambda(event);
    const store = getStore("onelife");
    await store.setJSON("sitedata", payload);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "server_error" }) };
  }
};
