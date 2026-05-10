import { pgTable, text, bigint, uuid, date, timestamp, varchar, index, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";

export type ContractStatus = "active" | "under_negotiation" | "sold" | "expired" | "cancelled";
export type OfferStatus = "pending" | "countered" | "accepted" | "rejected" | "expired" | "withdrawn";
export type RiskCategory = "low" | "medium" | "high";
export type TransactionType = "deposit" | "hold" | "release" | "settle" | "withdraw";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("full_name"),
  email: text("email").notNull(),
  walletBalance: bigint("wallet_balance", { mode: "number" }).notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
    riskCategory: varchar("risk_category", { length: 10 }).notNull().$type<RiskCategory>(),
    status: varchar("status", { length: 20 }).notNull().default("active").$type<ContractStatus>(),
    negotiationDeadline: timestamp("negotiation_deadline", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("contracts_status_idx").on(table.status),
    sellerIdx: index("contracts_seller_id_idx").on(table.sellerId),
  }),
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
    status: varchar("status", { length: 20 }).notNull().default("pending").$type<OfferStatus>(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    contractIdx: index("offers_contract_id_idx").on(table.contractId),
    buyerIdx: index("offers_buyer_id_idx").on(table.buyerId),
  }),
);

export const walletTransactions = pgTable(
  "wallet_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    amount: bigint("amount", { mode: "number" }).notNull(),
    type: varchar("type", { length: 20 }).notNull().$type<TransactionType>(),
    offerId: uuid("offer_id").references(() => offers.id),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("wallet_transactions_user_id_idx").on(table.userId),
  }),
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

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  user: one(users, {
    fields: [walletTransactions.userId],
    references: [users.id],
  }),
  offer: one(offers, {
    fields: [walletTransactions.offerId],
    references: [offers.id],
  }),
}));

// ============================================================================
// TABLAS DEL AGENTE FACTORBRIDGE
// ============================================================================

// Documentos validados (DNI/RUC)
export const documentos = pgTable("documentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  tipoDocumento: varchar("tipo_documento", { length: 10 }).notNull(), // "dni" o "ruc"
  numero: varchar("numero", { length: 20 }).notNull().unique(),
  nombre: text("nombre"),
  estado: varchar("estado", { length: 50 }),
  condicion: varchar("condicion", { length: 50 }),
  ultimaActualizacion: timestamp("ultima_actualizacion", { withTimezone: true }).defaultNow(),
  fuenteValidacion: varchar("fuente_validacion", { length: 50 }), // "apis_net_pe", "supabase_cache", etc.
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Scores crediticios
export const creditScores = pgTable("credit_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  documento: varchar("documento", { length: 20 }).notNull().unique(),
  score: integer("score").notNull(), // 0-850
  bandaRiesgo: varchar("banda_riesgo", { length: 20 }).notNull(), // "VERDE", "AMARILLO", "ROJO"
  morosidadActiva: boolean("morosidad_activa").notNull().default(false),
  listaNegraSBS: boolean("lista_negra_sbs").notNull().default(false),
  sunatNoHabido: boolean("sunat_no_habido").notNull().default(false),
  detalleRiesgos: jsonb("detalle_riesgos"), // Objeto JSON con detalles
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Cedentes (empresas que venden facturas)
export const cedentes = pgTable("cedentes", {
  id: uuid("id").primaryKey().defaultRandom(),
  ruc: varchar("ruc", { length: 11 }).notNull().unique(),
  razonSocial: text("razon_social").notNull(),
  sector: varchar("sector", { length: 100 }),
  facturasPendientes: integer("facturas_pendientes").default(0),
  montoPromedio: bigint("monto_promedio", { mode: "number" }),
  scorePromedio: integer("score_promedio"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Factores (inversionistas que compran facturas)
export const factores = pgTable("factores", {
  id: uuid("id").primaryKey().defaultRandom(),
  ruc: varchar("ruc", { length: 11 }).notNull().unique(),
  razonSocial: text("razon_social").notNull(),
  apetitoRiesgo: varchar("apetito_riesgo", { length: 20 }).notNull(), // "conservador", "moderado", "agresivo"
  sectoresPreferidos: jsonb("sectores_preferidos"), // Array de sectores
  montoMinimoInversion: bigint("monto_minimo_inversion", { mode: "number" }),
  montoMaximoInversion: bigint("monto_maximo_inversion", { mode: "number" }),
  plazosPreferidos: jsonb("plazos_preferidos"), // Array de rangos de días
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Intenciones de operación (matching)
export const intenciones = pgTable("intenciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorRole: varchar("actor_role", { length: 20 }).notNull(), // "cedente" o "factor"
  actorDocument: varchar("actor_document", { length: 20 }).notNull(),
  payload: jsonb("payload").notNull(), // Datos de la factura o preferencias
  estado: varchar("estado", { length: 20 }).notNull().default("pendiente"), // "pendiente", "procesada", "cancelada"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Row types
export type User = InferSelectModel<typeof users>;
export type Contract = InferSelectModel<typeof contracts>;
export type Offer = InferSelectModel<typeof offers>;
export type WalletTransaction = InferSelectModel<typeof walletTransactions>;
export type Documento = InferSelectModel<typeof documentos>;
export type CreditScore = InferSelectModel<typeof creditScores>;
export type Cedente = InferSelectModel<typeof cedentes>;
export type Factor = InferSelectModel<typeof factores>;
export type Intencion = InferSelectModel<typeof intenciones>;
