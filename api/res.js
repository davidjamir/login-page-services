const { renderPage } = require("../src/pages");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("ngrok-skip-browser-warning", "true");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(renderPage());
  } catch (err) {
    console.error("[api/blog-target] error:", err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Internal Server Error" });
  }
};
