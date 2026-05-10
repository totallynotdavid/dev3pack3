type JsonObject = Record<string, unknown>;

export type RiskCategory = "low" | "medium" | "high";
export type OfferAction = "accept" | "reject" | "counter";

type CreateContractBody = {
  debtorName: string;
  faceValue: number;
  currency: string;
  dueDate: string;
  riskCategory: RiskCategory;
};

type CreateOfferBody = {
  amount: number;
};

type OfferActionBody = {
  action: OfferAction;
  counterAmount?: number;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function getString(value: JsonObject, key: string): string | undefined {
  const field = value[key];
  return typeof field === "string" ? field.trim() : undefined;
}

function getNumber(value: JsonObject, key: string): number | undefined {
  const field = value[key];
  return typeof field === "number" && Number.isFinite(field) ? field : undefined;
}

function parseRiskCategory(value: string | undefined): RiskCategory | undefined {
  if (!value) return undefined;
  return value === "low" || value === "medium" || value === "high" ? value : undefined;
}

function parseOfferAction(value: string | undefined): OfferAction | undefined {
  if (!value) return undefined;
  return value === "accept" || value === "reject" || value === "counter" ? value : undefined;
}

export function parseCreateContractBody(body: unknown): CreateContractBody {
  if (!isObject(body)) throw new Error("Invalid request body");

  const debtorName = getString(body, "debtorName");
  const currency = getString(body, "currency");
  const dueDate = getString(body, "dueDate");
  const riskCategory = parseRiskCategory(getString(body, "riskCategory"));
  const faceValue = getNumber(body, "faceValue");

  if (!debtorName || !currency || !dueDate || !riskCategory || !faceValue || faceValue <= 0) {
    throw new Error("Missing or invalid required fields");
  }

  return { debtorName, faceValue, currency, dueDate, riskCategory };
}

export function parseCreateOfferBody(body: unknown): CreateOfferBody {
  if (!isObject(body)) throw new Error("Invalid request body");

  const amount = getNumber(body, "amount");
  if (!amount || amount <= 0) throw new Error("Invalid amount");

  return { amount };
}

export function parseOfferActionBody(body: unknown): OfferActionBody {
  if (!isObject(body)) throw new Error("Invalid request body");

  const action = parseOfferAction(getString(body, "action"));
  const counterAmount = getNumber(body, "counterAmount");

  if (!action) throw new Error("Invalid action");
  if (action === "counter" && (!counterAmount || counterAmount <= 0)) {
    throw new Error("Invalid counter amount");
  }

  return { action, counterAmount };
}
