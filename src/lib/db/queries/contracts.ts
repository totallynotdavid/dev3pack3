import sql, { type Contract, type ContractStatus } from "@/lib/db";

export async function createContract(
	sellerId: string,
	debtorName: string,
	faceValue: number,
	currency: string,
	dueDate: Date,
	riskCategory: "low" | "medium" | "high",
	documentUrl?: string
): Promise<Contract> {
	const result = await sql<Contract[]>`
    INSERT INTO contracts (seller_id, debtor_name, face_value, currency, due_date, risk_category, document_url)
    VALUES (${sellerId}, ${debtorName}, ${faceValue}, ${currency}, ${dueDate}, ${riskCategory}, ${documentUrl || null})
    RETURNING *
  `;

	return result[0];
}

export async function getContractById(contractId: string): Promise<Contract | null> {
	const result = await sql<Contract[]>`
    SELECT * FROM contracts WHERE id = ${contractId}
  `;

	return result.length > 0 ? result[0] : null;
}

export async function getActiveContracts(): Promise<Contract[]> {
	return sql<Contract[]>`
    SELECT * FROM contracts
    WHERE status = 'active'
    ORDER BY created_at DESC
  `;
}

export async function getSellerContracts(sellerId: string): Promise<Contract[]> {
	return sql<Contract[]>`
    SELECT * FROM contracts
    WHERE seller_id = ${sellerId}
    ORDER BY created_at DESC
  `;
}

export async function updateContractStatus(contractId: string, status: ContractStatus): Promise<Contract> {
	const result = await sql<Contract[]>`
    UPDATE contracts
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${contractId}
    RETURNING *
  `;

	return result[0];
}

export async function setNegotiationDeadline(contractId: string, deadline: Date): Promise<Contract> {
	const result = await sql<Contract[]>`
    UPDATE contracts
    SET negotiation_deadline = ${deadline}, updated_at = NOW()
    WHERE id = ${contractId}
    RETURNING *
  `;

	return result[0];
}

export async function cancelContract(contractId: string): Promise<Contract> {
	return updateContractStatus(contractId, "cancelled");
}
