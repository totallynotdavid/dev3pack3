import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config/env";

const AGENT_API_URL = config.agent.apiUrl;

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
