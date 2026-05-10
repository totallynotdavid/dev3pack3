import { type } from "arktype";

// Configuration boundary: Agent API runtime env parsing.
const agentEnvSchema = type({
  NEXT_PUBLIC_AGENT_API_URL: "string > 0",
});

type AgentConfig = {
  apiUrl: string;
};

export function loadAgentConfig(
  env: Record<string, string | undefined> = process.env,
): AgentConfig {
  const parsed = agentEnvSchema(env);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid agent environment configuration:\n- ${parsed.summary}`);
  }

  return {
    apiUrl: parsed.NEXT_PUBLIC_AGENT_API_URL.trim(),
  };
}

export const agentConfig = Object.freeze(loadAgentConfig());
