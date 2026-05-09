import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getOrCreateUser, addToUserBalance } from "@/lib/db/queries/users";
import { getContractById, setNegotiationDeadline } from "@/lib/db/queries/contracts";
import { createOffer } from "@/lib/db/queries/offers";
import { holdFunds } from "@/lib/db/queries/wallet";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id: contractId } = await params;
		const { amount } = (await request.json()) as { amount: number };

		if (!amount || amount <= 0) {
			return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
		}

		// Get or create user
		const user = await getOrCreateUser(userId, "", "");

		// Check wallet balance
		if (user.wallet_balance < amount) {
			return NextResponse.json(
				{ error: "Insufficient wallet balance" },
				{ status: 400 }
			);
		}

		// Get contract
		const contract = await getContractById(contractId);
		if (!contract) {
			return NextResponse.json({ error: "Contract not found" }, { status: 404 });
		}

		if (contract.status !== "active" && contract.status !== "under_negotiation") {
			return NextResponse.json(
				{ error: "Contract is not available for offers" },
				{ status: 400 }
			);
		}

		// Begin transaction: create offer and hold funds atomically
		// postgres.js doesn't support transactions natively in a simple way,
		// so we use raw SQL transaction
		const result = await sql.begin(async (transaction) => {
			// Create offer
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 7);

			const offers = await transaction<
				{ id: string }[]
			>`
        INSERT INTO offers (contract_id, buyer_id, amount, currency, expires_at)
        VALUES (${contractId}, ${userId}, ${amount}, ${contract.currency}, ${expiresAt})
        RETURNING id
      `;

			const offerId = offers[0].id;

			// Hold funds in wallet
			await transaction`
        UPDATE users
        SET wallet_balance = wallet_balance - ${amount}
        WHERE id = ${userId}
      `;

			// Record transaction
			await transaction`
        INSERT INTO wallet_transactions (user_id, amount, type, offer_id)
        VALUES (${userId}, ${-amount}, 'hold', ${offerId})
      `;

			// Set contract to under negotiation if this is first offer
			if (contract.status === "active") {
				const deadline = new Date();
				deadline.setDate(deadline.getDate() + 7);

				await transaction`
          UPDATE contracts
          SET status = 'under_negotiation', negotiation_deadline = ${deadline}, updated_at = NOW()
          WHERE id = ${contractId}
        `;
			}

			return offerId;
		});

		return NextResponse.json({ id: result, success: true });
	} catch (error) {
		console.error("Error creating offer:", error);
		return NextResponse.json(
			{ error: "Failed to create offer" },
			{ status: 500 }
		);
	}
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: contractId } = await params;

		const offers = await sql`
      SELECT * FROM offers
      WHERE contract_id = ${contractId}
      ORDER BY created_at DESC
    `;

		return NextResponse.json(offers);
	} catch (error) {
		console.error("Error fetching offers:", error);
		return NextResponse.json(
			{ error: "Failed to fetch offers" },
			{ status: 500 }
		);
	}
}
