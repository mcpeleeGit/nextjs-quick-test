export const runtime = "edge";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const returnUrl = url.searchParams.get("returnUrl") || "/";
    const clientId = process.env.KAKAO_REST_API_KEY;
    if (!clientId) {
      return new Response(JSON.stringify({ error: "Missing KAKAO_REST_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const origin = url.origin;
    const redirectUri = `${origin}/api/kakao/callback`;

    const authUrl = new URL(KAKAO_AUTH_URL);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", encodeURIComponent(returnUrl));

    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl.toString(),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


