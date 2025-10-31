export const runtime = "edge";

const USER_URL = "https://kapi.kakao.com/v2/user/me";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || request.headers.get("Cookie") || "";
    const encrypted = parseCookie(cookieHeader).get("ka_sess");
    if (!encrypted) {
      return new Response(JSON.stringify({ error: "NO_TOKEN" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Decrypt token from cookie
    const { decryptToken } = await import("../../../../utils/kakao-crypto");
    const token = await decryptToken(decodeURIComponent(encrypted));
    if (!token) {
      return new Response(JSON.stringify({ error: "INVALID_TOKEN" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(USER_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `KAKAO_${res.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function parseCookie(header: string): Map<string, string> {
  const map = new Map<string, string>();
  header.split(';').forEach((pair) => {
    const [rawKey, ...rest] = pair.trim().split('=');
    if (!rawKey) return;
    const key = rawKey;
    const value = rest.join('=');
    if (!key) return;
    if (value !== undefined) map.set(key, value);
  });
  return map;
}


