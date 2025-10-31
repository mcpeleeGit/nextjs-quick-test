export const runtime = "edge";

export async function POST() {
  // Clear the encrypted session cookie
  const headers = new Headers();
  headers.set("Set-Cookie", "ka_sess=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0");
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      ...Object.fromEntries(headers),
      "Content-Type": "application/json",
    },
  });
}
