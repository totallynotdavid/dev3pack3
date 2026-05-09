import { db } from "./index.ts";
import { users, contracts } from "./schema.ts";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create test users
    const testUsers = await db
      .insert(users)
      .values([
        {
          id: "user_seller_001",
          fullName: "John Seller",
          email: "seller@example.com",
          walletBalance: 0,
        },
        {
          id: "user_seller_002",
          fullName: "Jane Corporation",
          email: "jane@corp.com",
          walletBalance: 0,
        },
        {
          id: "user_buyer_001",
          fullName: "Investment Fund",
          email: "investor@fund.com",
          walletBalance: 500000, // $5,000 in cents = 500,000
        },
        {
          id: "user_buyer_002",
          fullName: "Mike Investor",
          email: "mike@invest.com",
          walletBalance: 250000, // $2,500
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`✓ Created ${testUsers.length} test users`);

    // Create test contracts
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 12);

    const testContracts = await db
      .insert(contracts)
      .values([
        {
          sellerId: "user_seller_001",
          debtorName: "Ministry of Health",
          faceValue: 100000, // $1,000 in cents
          currency: "USD",
          dueDate,
          riskCategory: "low",
          status: "active",
        },
        {
          sellerId: "user_seller_002",
          debtorName: "Municipality of Lima",
          faceValue: 250000, // $2,500
          currency: "PEN",
          dueDate,
          riskCategory: "medium",
          status: "active",
        },
        {
          sellerId: "user_seller_001",
          debtorName: "Department of Education",
          faceValue: 500000, // $5,000
          currency: "USD",
          dueDate,
          riskCategory: "high",
          status: "active",
        },
      ])
      .returning();

    console.log(`✓ Created ${testContracts.length} test contracts`);

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
