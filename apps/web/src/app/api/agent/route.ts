import { NextRequest, NextResponse } from "next/server";
import { type } from "arktype";
import { agentConfig } from "@/config/env-agent";

const AGENT_API_URL = agentConfig.apiUrl;
const agentProxyBodySchema = type({ "[string]": "unknown" });

export async function POST(request: NextRequest) {
  try {
    const parsedBody = agentProxyBodySchema(await request.json());
    if (parsedBody instanceof type.errors) {
      return NextResponse.json(
        { error: `Invalid agent payload: ${parsedBody.summary}` },
        { status: 400 },
      );
    }

    const response = await fetch(AGENT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody),
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
