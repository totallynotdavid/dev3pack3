import sql, { type Offer, type OfferStatus } from "@/lib/db";

export async function createOffer(
	contractId: string,
	buyerId: string,
	amount: number,
	currency: string,
	expiresAt: Date
): Promise<Offer> {
	const result = await sql<Offer[]>`
    INSERT INTO offers (contract_id, buyer_id, amount, currency, expires_at)
    VALUES (${contractId}, ${buyerId}, ${amount}, ${currency}, ${expiresAt})
    RETURNING *
  `;

	return result[0];
}

export async function getOfferById(offerId: string): Promise<Offer | null> {
	const result = await sql<Offer[]>`
    SELECT * FROM offers WHERE id = ${offerId}
  `;

	return result.length > 0 ? result[0] : null;
}

export async function getContractOffers(contractId: string): Promise<Offer[]> {
	return sql<Offer[]>`
    SELECT * FROM offers
    WHERE contract_id = ${contractId}
    ORDER BY created_at DESC
  `;
}

export async function getBuyerOffers(buyerId: string): Promise<Offer[]> {
	return sql<Offer[]>`
    SELECT * FROM offers
    WHERE buyer_id = ${buyerId}
    ORDER BY created_at DESC
  `;
}

export async function updateOfferStatus(offerId: string, status: OfferStatus): Promise<Offer> {
	const result = await sql<Offer[]>`
    UPDATE offers
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${offerId}
    RETURNING *
  `;

	return result[0];
}

export async function setCounterOffer(offerId: string, counterAmount: number): Promise<Offer> {
	const result = await sql<Offer[]>`
    UPDATE offers
    SET counter_amount = ${counterAmount}, status = 'countered', updated_at = NOW()
    WHERE id = ${offerId}
    RETURNING *
  `;

	return result[0];
}

export async function acceptOffer(offerId: string): Promise<Offer> {
	return updateOfferStatus(offerId, "accepted");
}

export async function rejectOffer(offerId: string): Promise<Offer> {
	return updateOfferStatus(offerId, "rejected");
}

export async function withdrawOffer(offerId: string): Promise<Offer> {
	return updateOfferStatus(offerId, "withdrawn");
}

export async function expireOffer(offerId: string): Promise<Offer> {
	return updateOfferStatus(offerId, "expired");
}
