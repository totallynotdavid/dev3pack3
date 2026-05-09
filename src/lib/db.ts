import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

export default sql;

export type ContractStatus = "active" | "under_negotiation" | "sold" | "expired" | "cancelled";
export type OfferStatus = "pending" | "countered" | "accepted" | "rejected" | "expired" | "withdrawn";
export type RiskCategory = "low" | "medium" | "high";
export type TransactionType = "deposit" | "hold" | "release" | "settle" | "withdraw";

export interface User {
	id: string;
	full_name: string | null;
	email: string;
	wallet_balance: number;
	created_at: Date;
}

export interface Contract {
	id: string;
	seller_id: string;
	debtor_name: string;
	face_value: number;
	currency: string;
	due_date: Date;
	document_url: string | null;
	risk_category: RiskCategory;
	status: ContractStatus;
	negotiation_deadline: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface Offer {
	id: string;
	contract_id: string;
	buyer_id: string;
	amount: number;
	counter_amount: number | null;
	status: OfferStatus;
	expires_at: Date;
	created_at: Date;
	updated_at: Date;
}

export interface WalletTransaction {
	id: string;
	user_id: string;
	amount: number;
	type: TransactionType;
	offer_id: string | null;
	stripe_payment_intent_id: string | null;
	created_at: Date;
}
