export const runtime = "edge";

const SOURCE_URL = "http://test-tam.pe.kr/api/famoussaying";

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, { cache: "no-store" });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream error: ${res.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


