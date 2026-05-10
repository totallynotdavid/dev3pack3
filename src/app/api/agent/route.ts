import { NextRequest, NextResponse } from "next/server";

const AGENT_API_URL =
  process.env.NEXT_PUBLIC_AGENT_API_URL ||
  "https://factor-bridge-agent-197950168142.us-central1.run.app/query";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(AGENT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Agent API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Agent proxy error:", error);
    return NextResponse.json(
      {
        response:
          "Lo siento, hubo un error al conectar con el agente. Por favor intenta nuevamente.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
