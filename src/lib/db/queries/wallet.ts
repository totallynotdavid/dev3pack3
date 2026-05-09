import { db } from "@/db";
import { walletTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function createTransaction(
  userId: string,
  amount: number,
  type: string,
  offerId?: string | null,
  stripePaymentIntentId?: string | null,
) {
  const result = await db
    .insert(walletTransactions)
    .values({
      userId,
      amount,
      type,
      offerId: offerId || null,
      stripePaymentIntentId: stripePaymentIntentId || null,
    })
    .returning();

  return result[0];
}

export async function getUserTransactions(userId: string) {
  return db.query.walletTransactions.findMany({
    where: eq(walletTransactions.userId, userId),
    orderBy: desc(walletTransactions.createdAt),
  });
}

export async function getTransactionsByOffer(offerId: string) {
  return db.query.walletTransactions.findMany({
    where: eq(walletTransactions.offerId, offerId),
    orderBy: desc(walletTransactions.createdAt),
  });
}

export async function holdFunds(userId: string, amount: number, offerId: string) {
  return createTransaction(userId, -amount, "hold", offerId);
}

export async function releaseFunds(userId: string, amount: number, offerId: string) {
  return createTransaction(userId, amount, "release", offerId);
}

export async function settleFunds(userId: string, amount: number, offerId: string) {
  return createTransaction(userId, amount, "settle", offerId);
}

export async function depositFunds(userId: string, amount: number, stripePaymentIntentId: string) {
  return createTransaction(userId, amount, "deposit", null, stripePaymentIntentId);
}
