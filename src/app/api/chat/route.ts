import { type NextRequest } from "next/server";

const GATEWAY_URL =
  process.env.AGENT_GATEWAY_URL ?? "http://localhost:8000/api/chat";

const PASSTHROUGH_HEADERS = [
  "content-type",
  "x-gateway-provider",
  "x-gateway-model",
] as const;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  let upstream: Response;
  try {
    upstream = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: req.signal,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: `Gateway unreachable: ${message}` }),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const headers = new Headers();
  for (const name of PASSTHROUGH_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", "text/plain; charset=utf-8");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
