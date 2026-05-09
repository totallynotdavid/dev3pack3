import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(clerkId: string, email: string, fullName?: string) {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, clerkId),
  });

  if (existing) {
    return existing;
  }

  const created = await db
    .insert(users)
    .values({
      id: clerkId,
      email,
      fullName: fullName || null,
    })
    .returning();

  return created[0];
}

export async function getUserById(clerkId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, clerkId),
  });
}

export async function updateUserBalance(clerkId: string, newBalance: number) {
  const updated = await db
    .update(users)
    .set({ walletBalance: newBalance })
    .where(eq(users.id, clerkId))
    .returning();

  return updated[0];
}

export async function addToUserBalance(clerkId: string, amount: number) {
  const user = await getUserById(clerkId);
  if (!user) throw new Error("User not found");

  return updateUserBalance(clerkId, user.walletBalance + amount);
}
