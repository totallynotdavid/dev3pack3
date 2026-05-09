// Re-export Drizzle database and types for backward compatibility
export { db as default } from "./index";
export { db } from "./index";
export type { Database } from "./index";

// Re-export schema types
export type {
	users as User,
	contracts as Contract,
	offers as Offer,
	walletTransactions as WalletTransaction,
} from "./schema";

// Type aliases for convenience
export type ContractStatus = "active" | "under_negotiation" | "sold" | "expired" | "cancelled";
export type OfferStatus = "pending" | "countered" | "accepted" | "rejected" | "expired" | "withdrawn";
export type RiskCategory = "low" | "medium" | "high";
export type TransactionType = "deposit" | "hold" | "release" | "settle" | "withdraw";
