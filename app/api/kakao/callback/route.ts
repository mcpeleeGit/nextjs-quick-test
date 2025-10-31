export const runtime = "edge";

const TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const USER_URL = "https://kapi.kakao.com/v2/user/me";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const clientId = process.env.KAKAO_REST_API_KEY;
  if (!clientId) {
    return new Response("Missing KAKAO_REST_API_KEY", { status: 500 });
  }
  const origin = url.origin;
  const redirectUri = `${origin}/api/kakao/callback`;

  const returnUrl = state ? decodeURIComponent(state) : "/";

  if (!code) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${returnUrl}?kakao=error&reason=missing_code`,
      },
    });
  }

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!tokenRes.ok) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${returnUrl}?kakao=error&reason=token_${tokenRes.status}`,
        },
      });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token as string | undefined;
    const expiresIn = Number(tokenData?.expires_in) || 3600;

    // Optionally fetch user info
    let nickname = "";
    if (accessToken) {
      try {
        const userRes = await fetch(USER_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (userRes.ok) {
          const user = await userRes.json();
          nickname = user?.kakao_account?.profile?.nickname || "";
        }
      } catch {}
    }

    const redirectTarget = new URL(returnUrl, origin);
    redirectTarget.searchParams.set("kakao", "ok");
    if (nickname) redirectTarget.searchParams.set("nickname", nickname);

    const isHttps = url.protocol === "https:";
    const cookieParts = [
      `kakao_access_token=${accessToken ? encodeURIComponent(accessToken) : ""}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${expiresIn}`,
    ];
    if (isHttps) cookieParts.push("Secure");
    const setCookie = cookieParts.join("; ");

    const headers = new Headers();
    headers.set("Location", redirectTarget.toString());
    if (accessToken) headers.append("Set-Cookie", setCookie);

    return new Response(null, {
      status: 302,
      headers,
    });
  } catch (e) {
    const redirectTarget = new URL(returnUrl, origin);
    redirectTarget.searchParams.set("kakao", "error");
    return new Response(null, {
      status: 302,
      headers: { Location: redirectTarget.toString() },
    });
  }
}


