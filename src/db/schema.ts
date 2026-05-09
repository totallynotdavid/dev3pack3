import {
	pgTable,
	text,
	bigint,
	uuid,
	date,
	timestamp,
	varchar,
	index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	fullName: text("full_name"),
	email: text("email").notNull(),
	walletBalance: bigint("wallet_balance", { mode: "number" }).notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const contracts = pgTable(
	"contracts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		sellerId: text("seller_id")
			.notNull()
			.references(() => users.id),
		debtorName: text("debtor_name").notNull(),
		faceValue: bigint("face_value", { mode: "number" }).notNull(),
		currency: varchar("currency", { length: 3 }).notNull().default("USD"),
		dueDate: date("due_date", { mode: "date" }).notNull(),
		documentUrl: text("document_url"),
		riskCategory: varchar("risk_category", { length: 10 }).notNull(),
		status: varchar("status", { length: 20 })
			.notNull()
			.default("active"),
		negotiationDeadline: timestamp("negotiation_deadline", {
			withTimezone: true,
		}),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		statusIdx: index("contracts_status_idx").on(table.status),
		sellerIdx: index("contracts_seller_id_idx").on(table.sellerId),
	})
);

export const offers = pgTable(
	"offers",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		contractId: uuid("contract_id")
			.notNull()
			.references(() => contracts.id),
		buyerId: text("buyer_id")
			.notNull()
			.references(() => users.id),
		amount: bigint("amount", { mode: "number" }).notNull(),
		currency: varchar("currency", { length: 3 }).notNull().default("USD"),
		counterAmount: bigint("counter_amount", { mode: "number" }),
		status: varchar("status", { length: 20 }).notNull().default("pending"),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		contractIdx: index("offers_contract_id_idx").on(table.contractId),
		buyerIdx: index("offers_buyer_id_idx").on(table.buyerId),
	})
);

export const walletTransactions = pgTable(
	"wallet_transactions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		amount: bigint("amount", { mode: "number" }).notNull(),
		type: varchar("type", { length: 20 }).notNull(),
		offerId: uuid("offer_id").references(() => offers.id),
		stripePaymentIntentId: text("stripe_payment_intent_id"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		userIdx: index("wallet_transactions_user_id_idx").on(table.userId),
	})
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	contracts: many(contracts),
	offers: many(offers),
	walletTransactions: many(walletTransactions),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
	seller: one(users, {
		fields: [contracts.sellerId],
		references: [users.id],
	}),
	offers: many(offers),
}));

export const offersRelations = relations(offers, ({ one, many }) => ({
	contract: one(contracts, {
		fields: [offers.contractId],
		references: [contracts.id],
	}),
	buyer: one(users, {
		fields: [offers.buyerId],
		references: [users.id],
	}),
	walletTransactions: many(walletTransactions),
}));

export const walletTransactionsRelations = relations(
	walletTransactions,
	({ one }) => ({
		user: one(users, {
			fields: [walletTransactions.userId],
			references: [users.id],
		}),
		offer: one(offers, {
			fields: [walletTransactions.offerId],
			references: [offers.id],
		}),
	})
);
