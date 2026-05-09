import sql, { type WalletTransaction, type TransactionType } from "@/lib/db";

export async function createTransaction(
	userId: string,
	amount: number,
	type: TransactionType,
	offerId?: string | null,
	stripePaymentIntentId?: string | null
): Promise<WalletTransaction> {
	const result = await sql<WalletTransaction[]>`
    INSERT INTO wallet_transactions (user_id, amount, type, offer_id, stripe_payment_intent_id)
    VALUES (${userId}, ${amount}, ${type}, ${offerId || null}, ${stripePaymentIntentId || null})
    RETURNING *
  `;

	return result[0];
}

export async function getUserTransactions(userId: string): Promise<WalletTransaction[]> {
	return sql<WalletTransaction[]>`
    SELECT * FROM wallet_transactions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function getTransactionsByOffer(offerId: string): Promise<WalletTransaction[]> {
	return sql<WalletTransaction[]>`
    SELECT * FROM wallet_transactions
    WHERE offer_id = ${offerId}
    ORDER BY created_at DESC
  `;
}

export async function holdFunds(userId: string, amount: number, offerId: string): Promise<WalletTransaction> {
	return createTransaction(userId, -amount, "hold", offerId);
}

export async function releaseFunds(userId: string, amount: number, offerId: string): Promise<WalletTransaction> {
	return createTransaction(userId, amount, "release", offerId);
}

export async function settleFunds(userId: string, amount: number, offerId: string): Promise<WalletTransaction> {
	return createTransaction(userId, amount, "settle", offerId);
}

export async function depositFunds(
	userId: string,
	amount: number,
	stripePaymentIntentId: string
): Promise<WalletTransaction> {
	return createTransaction(userId, amount, "deposit", null, stripePaymentIntentId);
}
