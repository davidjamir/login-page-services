export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  console.log(code);
  const tokenRes = await fetch(
    "https://graph.facebook.com/v25.0/oauth/access_token?" +
      new URLSearchParams({
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: process.env.FB_REDIRECT_URI,
        code,
      }),
  );

  const tokenData = await tokenRes.json();

  console.log(tokenData);
  // 👉 tạm thời trả ra để debug
  res.json({
    step: "user_access_token",
    tokenData,
  });
}
