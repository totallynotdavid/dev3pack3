import { db } from "@/db";
import { offers, type OfferStatus } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function createOffer(
  contractId: string,
  buyerId: string,
  amount: number,
  currency: string,
  expiresAt: Date,
) {
  const result = await db
    .insert(offers)
    .values({
      contractId,
      buyerId,
      amount,
      currency,
      expiresAt,
    })
    .returning();

  return result[0];
}

export async function getOfferById(offerId: string) {
  return db.query.offers.findFirst({
    where: eq(offers.id, offerId),
  });
}

export async function getContractOffers(contractId: string) {
  return db.query.offers.findMany({
    where: eq(offers.contractId, contractId),
    orderBy: desc(offers.createdAt),
  });
}

export async function getBuyerOffers(buyerId: string) {
  return db.query.offers.findMany({
    where: eq(offers.buyerId, buyerId),
    orderBy: desc(offers.createdAt),
  });
}

export async function updateOfferStatus(offerId: string, status: OfferStatus) {
  const updated = await db
    .update(offers)
    .set({ status, updatedAt: new Date() })
    .where(eq(offers.id, offerId))
    .returning();

  return updated[0];
}

export async function setCounterOffer(offerId: string, counterAmount: number) {
  const updated = await db
    .update(offers)
    .set({
      counterAmount,
      status: "countered",
      updatedAt: new Date(),
    })
    .where(eq(offers.id, offerId))
    .returning();

  return updated[0];
}

export async function acceptOffer(offerId: string) {
  return updateOfferStatus(offerId, "accepted");
}

export async function rejectOffer(offerId: string) {
  return updateOfferStatus(offerId, "rejected");
}

export async function withdrawOffer(offerId: string) {
  return updateOfferStatus(offerId, "withdrawn");
}

export async function expireOffer(offerId: string) {
  return updateOfferStatus(offerId, "expired");
}
