import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contracts, offers, users, walletTransactions } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { getContractById } from "@/lib/db/queries/contracts";
import { getOfferById } from "@/lib/db/queries/offers";

type Action = "accept" | "reject" | "counter";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; offerId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: contractId, offerId } = await params;
    const body = (await request.json()) as { action: Action; counterAmount?: number };
    const { action, counterAmount } = body;

    const contract = await getContractById(contractId);
    if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    if (contract.sellerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const offer = await getOfferById(offerId);
    if (!offer || offer.contractId !== contractId) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    if (offer.status !== "pending" && offer.status !== "countered") {
      return NextResponse.json({ error: "Offer cannot be actioned in its current state" }, { status: 400 });
    }

    if (action === "accept") {
      await db.transaction(async (tx) => {
        await tx
          .update(offers)
          .set({ status: "accepted", updatedAt: new Date() })
          .where(eq(offers.id, offerId));

        const otherPending = await tx
          .select()
          .from(offers)
          .where(
            and(
              eq(offers.contractId, contractId),
              ne(offers.id, offerId),
              eq(offers.status, "pending"),
            ),
          );

        for (const o of otherPending) {
          await tx
            .update(offers)
            .set({ status: "rejected", updatedAt: new Date() })
            .where(eq(offers.id, o.id));

          await tx
            .update(users)
            .set({ walletBalance: sql`wallet_balance + ${o.amount}` })
            .where(eq(users.id, o.buyerId));

          await tx.insert(walletTransactions).values({
            userId: o.buyerId,
            amount: o.amount,
            type: "release",
            offerId: o.id,
          });
        }

        await tx
          .update(users)
          .set({ walletBalance: sql`wallet_balance + ${offer.amount}` })
          .where(eq(users.id, userId));

        await tx.insert(walletTransactions).values({
          userId,
          amount: offer.amount,
          type: "settle",
          offerId,
        });

        await tx
          .update(contracts)
          .set({ status: "sold", updatedAt: new Date() })
          .where(eq(contracts.id, contractId));
      });
    } else if (action === "reject") {
      await db.transaction(async (tx) => {
        await tx
          .update(offers)
          .set({ status: "rejected", updatedAt: new Date() })
          .where(eq(offers.id, offerId));

        await tx
          .update(users)
          .set({ walletBalance: sql`wallet_balance + ${offer.amount}` })
          .where(eq(users.id, offer.buyerId));

        await tx.insert(walletTransactions).values({
          userId: offer.buyerId,
          amount: offer.amount,
          type: "release",
          offerId,
        });
      });
    } else if (action === "counter") {
      if (!counterAmount || counterAmount <= 0) {
        return NextResponse.json({ error: "Invalid counter amount" }, { status: 400 });
      }
      await db
        .update(offers)
        .set({ counterAmount, status: "countered", updatedAt: new Date() })
        .where(eq(offers.id, offerId));
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing offer action:", error);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
