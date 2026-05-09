import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getOrCreateUser } from "@/lib/db/queries/users";
import { createContract } from "@/lib/db/queries/contracts";

export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { debtorName, faceValue, currency, dueDate, riskCategory } =
			(await request.json()) as {
				debtorName: string;
				faceValue: number;
				currency: string;
				dueDate: string;
				riskCategory: "low" | "medium" | "high";
			};

		// Validate input
		if (!debtorName || !faceValue || !dueDate || !riskCategory) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Ensure user exists
		await getOrCreateUser(userId, "", "");

		// Create contract
		const contract = await createContract(
			userId,
			debtorName,
			faceValue,
			currency,
			new Date(dueDate),
			riskCategory
		);

		return NextResponse.json({ id: contract.id, success: true });
	} catch (error) {
		console.error("Error creating contract:", error);
		return NextResponse.json(
			{ error: "Failed to create contract" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const status = request.nextUrl.searchParams.get("status") || "active";

		const contracts = await sql`
      SELECT * FROM contracts
      WHERE status = ${status}
      ORDER BY created_at DESC
      LIMIT 50
    `;

		return NextResponse.json(contracts);
	} catch (error) {
		console.error("Error fetching contracts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch contracts" },
			{ status: 500 }
		);
	}
}
