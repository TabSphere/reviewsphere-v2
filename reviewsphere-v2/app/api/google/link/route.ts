import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // If Google OAuth is configured, return the OAuth consent URL as JSON so
  // the client can navigate there. Otherwise show the friendly HTML guidance.
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"}/api/google/callback`;

  if (clientId) {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/business.manage openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    return NextResponse.json({ url: authUrl.toString() });
  }

  // Friendly HTML page guiding the developer to configure Google OAuth.
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Google Business Linking — Not Configured</title>
      <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a;background:#fff;padding:28px} .card{max-width:720px;margin:36px auto;padding:24px;border-radius:12px;border:1px solid #e6eefc;background:linear-gradient(180deg,#fff,#fbfdff)}</style>
    </head>
    <body>
      <div class="card">
        <h1>Google Business linking is not configured</h1>
        <p>This demo route is a placeholder. To enable Google Business linking:</p>
        <ol>
          <li>Set <strong>GOOGLE_CLIENT_ID</strong> and <strong>GOOGLE_CLIENT_SECRET</strong> in your environment.</li>
          <li>Implement OAuth redirect and callback handlers to exchange the code for tokens.</li>
          <li>Store the access token securely (for example in a Supabase &lt;code&gt;oauth_tokens&lt;/code&gt; table) and associate it with the user's &lt;code&gt;profiles&lt;/code&gt; row.</li>
        </ol>
        <p>If you want me to implement the OAuth flow, provide the client credentials or say so and I will scaffold the redirect/callback handlers.</p>
        <p><a href="/dashboard">Back to dashboard</a></p>
      </div>
    </body>
  </html>`;

  return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html" } });
}
