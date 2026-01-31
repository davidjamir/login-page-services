const { isAuthorized } = require("../helper/isAuthorized.js");
const { savePages } = require("../src/pages.js");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const body = req.body || {};

    const payload = body.map((item) => ({
      source: item.source,
      pageId: item.id,
      name: item.name,
      token: item.access_token,
    }));

    const r = await savePages(payload);
    return res.json({
      ok: true,
      ...r,
    });
  } catch (err) {
    console.error("[api/blog-target] error:", err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Internal Server Error" });
  }
};
