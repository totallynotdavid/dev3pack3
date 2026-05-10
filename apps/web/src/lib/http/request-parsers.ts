import { type } from "arktype";

export type RiskCategory = "low" | "medium" | "high";
export type OfferAction = "accept" | "reject" | "counter";
export type ContractStatus = "active" | "under_negotiation" | "sold" | "expired" | "cancelled";

const createContractBodySchema = type({
  debtorName: "string > 0",
  faceValue: "number > 0",
  currency: "string > 0",
  dueDate: "string > 0",
  riskCategory: "'low' | 'medium' | 'high'",
});

const createOfferBodySchema = type({
  amount: "number > 0",
});

const offerActionBodySchema = type({
  action: "'accept' | 'reject' | 'counter'",
  "counterAmount?": "number > 0",
});

const contractStatusSchema = type(
  "'active' | 'under_negotiation' | 'sold' | 'expired' | 'cancelled'",
);

const ogQuerySchema = type({
  "title?": "string <= 120",
  "subtitle?": "string <= 180",
});

export function parseCreateContractBody(body: unknown): typeof createContractBodySchema.infer {
  const parsed = createContractBodySchema(body);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid contract payload: ${parsed.summary}`);
  }
  return parsed;
}

export function parseCreateOfferBody(body: unknown): typeof createOfferBodySchema.infer {
  const parsed = createOfferBodySchema(body);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid offer payload: ${parsed.summary}`);
  }
  return parsed;
}

export function parseOfferActionBody(body: unknown): typeof offerActionBodySchema.infer {
  const parsed = offerActionBodySchema(body);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid offer action payload: ${parsed.summary}`);
  }
  if (parsed.action === "counter" && !parsed.counterAmount) {
    throw new Error("Invalid offer action payload: counterAmount is required for counter action");
  }
  return parsed;
}

export function parseContractStatus(
  raw: string | null,
  fallback: ContractStatus = "active",
): ContractStatus {
  if (!raw) return fallback;
  const parsed = contractStatusSchema(raw);
  if (parsed instanceof type.errors) return fallback;
  return parsed;
}

export function parseOgImageQuery(searchParams: URLSearchParams): {
  title: string;
  subtitle: string;
} {
  const parsed = ogQuerySchema({
    title: searchParams.get("title") ?? undefined,
    subtitle: searchParams.get("subtitle") ?? undefined,
  });
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid OG query params: ${parsed.summary}`);
  }

  return {
    title: parsed.title ?? "Marketplace",
    subtitle: parsed.subtitle ?? "Trade government contracts at the best rates",
  };
}
