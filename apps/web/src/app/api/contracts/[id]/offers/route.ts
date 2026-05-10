import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contracts, offers, users, walletTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/db/queries/users";
import { getContractById } from "@/lib/db/queries/contracts";
import { getContractOffers } from "@/lib/db/queries/offers";
import { parseCreateOfferBody } from "@/lib/http/request-parsers";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: contractId } = await params;
    const { amount } = parseCreateOfferBody(await request.json());

    // Get or create user
    const user = await getOrCreateUser(userId, "", "");

    // Check wallet balance
    if (user.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }

    // Get contract
    const contract = await getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (contract.sellerId === userId) {
      return NextResponse.json(
        { error: "You cannot make an offer on your own contract" },
        { status: 403 },
      );
    }

    if (contract.status !== "active" && contract.status !== "under_negotiation") {
      return NextResponse.json({ error: "Contract is not available for offers" }, { status: 400 });
    }

    // Begin transaction: create offer and hold funds atomically
    const result = await db.transaction(async (tx) => {
      // Create offer
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const newOffers = await tx
        .insert(offers)
        .values({
          contractId,
          buyerId: userId,
          amount,
          currency: contract.currency,
          expiresAt,
        })
        .returning();

      const offerId = newOffers[0].id;

      // Hold funds in wallet
      await tx
        .update(users)
        .set({ walletBalance: user.walletBalance - amount })
        .where(eq(users.id, userId));

      // Record transaction
      await tx.insert(walletTransactions).values({
        userId,
        amount: -amount,
        type: "hold",
        offerId,
      });

      // Set contract to under negotiation if this is first offer
      if (contract.status === "active") {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);

        await tx
          .update(contracts)
          .set({
            status: "under_negotiation",
            negotiationDeadline: deadline,
            updatedAt: new Date(),
          })
          .where(eq(contracts.id, contractId));
      }

      return offerId;
    });

    revalidateTag("contracts", "max");
    return NextResponse.json({ id: result, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Invalid offer payload:")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contractId } = await params;
    const contractOffers = await getContractOffers(contractId);
    return NextResponse.json(contractOffers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
