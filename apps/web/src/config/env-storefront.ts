import { type } from "arktype";

// Configuration boundary: storefront runtime env parsing.
const storefrontEnvSchema = type({
  NEXT_PUBLIC_STOREFRONT_URL: "string > 0",
});

type StorefrontConfig = {
  url: string;
};

export function loadStorefrontConfig(
  env: Record<string, string | undefined> = process.env,
): StorefrontConfig {
  const parsed = storefrontEnvSchema(env);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid storefront environment configuration:\n- ${parsed.summary}`);
  }

  return {
    url: parsed.NEXT_PUBLIC_STOREFRONT_URL.trim(),
  };
}

export const storefrontConfig = Object.freeze(loadStorefrontConfig());
