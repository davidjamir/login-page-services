export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.FB_APP_ID,
    redirect_uri: process.env.FB_REDIRECT_URI,
    response_type: "code",
    scope: [
      "public_profile",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_manage_posts",
    ].join(","),
  });

  res.writeHead(302, {
    Location: `https://www.facebook.com/v24.0/dialog/oauth?${params}`,
  });
  res.end();
}
