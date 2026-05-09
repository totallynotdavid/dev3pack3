import sql, { type User } from "@/lib/db";

export async function getOrCreateUser(clerkId: string, email: string, fullName?: string): Promise<User> {
	const existing = await sql<User[]>`
    SELECT * FROM users WHERE id = ${clerkId}
  `;

	if (existing.length > 0) {
		return existing[0];
	}

	const created = await sql<User[]>`
    INSERT INTO users (id, email, full_name)
    VALUES (${clerkId}, ${email}, ${fullName || null})
    RETURNING *
  `;

	return created[0];
}

export async function getUserById(clerkId: string): Promise<User | null> {
	const result = await sql<User[]>`
    SELECT * FROM users WHERE id = ${clerkId}
  `;

	return result.length > 0 ? result[0] : null;
}

export async function updateUserBalance(clerkId: string, newBalance: number): Promise<User> {
	const result = await sql<User[]>`
    UPDATE users
    SET wallet_balance = ${newBalance}
    WHERE id = ${clerkId}
    RETURNING *
  `;

	return result[0];
}

export async function addToUserBalance(clerkId: string, amount: number): Promise<User> {
	const result = await sql<User[]>`
    UPDATE users
    SET wallet_balance = wallet_balance + ${amount}
    WHERE id = ${clerkId}
    RETURNING *
  `;

	return result[0];
}
