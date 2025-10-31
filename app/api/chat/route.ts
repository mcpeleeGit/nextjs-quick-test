import OpenAI from "openai";

export const runtime = "edge";

type IncomingMessage = {
  role: string;
  content?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming: IncomingMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];
    const model: string = body?.model || "gpt-4o-mini";
    const temperature: number =
      typeof body?.temperature === "number" ? body.temperature : 0.7;

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY on server" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (incoming.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sanitize and coerce incoming messages to OpenAI SDK's expected shape
    const messages = incoming
      .map((m) => {
        const role = typeof m.role === "string" ? m.role : "";
        const content = typeof m.content === "string" ? m.content : "";
        if (!content) return null;
        if (role === "system" || role === "user" || role === "assistant") {
          return { role, content };
        }
        // Drop unsupported roles like "tool" to avoid type mismatches
        return null;
      })
      .filter((m): m is { role: string; content: string } => m !== null);

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid messages after sanitization" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model,
      // Cast to any to satisfy TS in some build environments; shape is valid at runtime
      messages: messages as any,
      temperature,
    });

    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


