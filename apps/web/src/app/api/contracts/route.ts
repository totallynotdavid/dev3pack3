import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contracts, type ContractStatus } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const VALID_STATUSES = [
  "active",
  "under_negotiation",
  "sold",
  "expired",
  "cancelled",
] as const satisfies ContractStatus[];

function isContractStatus(s: string): s is ContractStatus {
  return (VALID_STATUSES as readonly string[]).includes(s);
}

function parseStatus(raw: string | null): ContractStatus {
  const s = raw ?? "active";
  return isContractStatus(s) ? s : "active";
}
import { getOrCreateUser } from "@/lib/db/queries/users";
import { createContract } from "@/lib/db/queries/contracts";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { debtorName, faceValue, currency, dueDate, riskCategory } = (await request.json()) as {
      debtorName: string;
      faceValue: number;
      currency: string;
      dueDate: string;
      riskCategory: "low" | "medium" | "high";
    };

    // Validate input
    if (!debtorName || !faceValue || !dueDate || !riskCategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
      riskCategory,
    );

    revalidateTag("contracts", "max");
    return NextResponse.json({ id: contract.id, success: true });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = parseStatus(request.nextUrl.searchParams.get("status"));

    const contractList = await db
      .select()
      .from(contracts)
      .where(eq(contracts.status, status))
      .orderBy(desc(contracts.createdAt))
      .limit(50);

    return NextResponse.json(contractList);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
  }
}
