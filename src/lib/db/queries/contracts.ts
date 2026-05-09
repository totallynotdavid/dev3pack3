import { db } from "@/db/index.ts";
import { contracts } from "@/db/schema.ts";
import { eq, desc } from "drizzle-orm";

export async function createContract(
  sellerId: string,
  debtorName: string,
  faceValue: number,
  currency: string,
  dueDate: Date,
  riskCategory: "low" | "medium" | "high",
  documentUrl?: string,
) {
  const result = await db
    .insert(contracts)
    .values({
      sellerId,
      debtorName,
      faceValue,
      currency,
      dueDate,
      riskCategory,
      documentUrl: documentUrl || null,
    })
    .returning();

  return result[0];
}

export async function getContractById(contractId: string) {
  return db.query.contracts.findFirst({
    where: eq(contracts.id, contractId),
  });
}

export async function getActiveContracts() {
  return db.query.contracts.findMany({
    where: eq(contracts.status, "active"),
    orderBy: desc(contracts.createdAt),
  });
}

export async function getSellerContracts(sellerId: string) {
  return db.query.contracts.findMany({
    where: eq(contracts.sellerId, sellerId),
    orderBy: desc(contracts.createdAt),
  });
}

export async function updateContractStatus(contractId: string, status: string) {
  const updated = await db
    .update(contracts)
    .set({ status, updatedAt: new Date() })
    .where(eq(contracts.id, contractId))
    .returning();

  return updated[0];
}

export async function setNegotiationDeadline(contractId: string, deadline: Date) {
  const updated = await db
    .update(contracts)
    .set({ negotiationDeadline: deadline, updatedAt: new Date() })
    .where(eq(contracts.id, contractId))
    .returning();

  return updated[0];
}

export async function cancelContract(contractId: string) {
  return updateContractStatus(contractId, "cancelled");
}
