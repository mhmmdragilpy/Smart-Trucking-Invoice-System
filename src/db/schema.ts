import { pgTable, uuid, text, integer, boolean, date, numeric, timestamp, check, uniqueIndex, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- EXISTING TABLES (Invoices, Items, Counters) ---

// 1. Invoices Table
export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceNumber: text("invoice_number").notNull().unique(),
    customerName: text("customer_name").notNull(),
    invoiceTypeId: integer("invoice_type_id").notNull(),
    invoiceTypeName: text("invoice_type_name").notNull(),
    bankGroup: text("bank_group"),
    isFee: boolean("is_fee").default(false),
    invoiceDate: date("invoice_date").notNull(),
    periodStart: date("period_start"),
    periodEnd: date("period_end"),
    totalAmount: numeric("total_amount").default("0"),
    dp: numeric("dp").default("0"),
    taxRate: numeric("tax_rate"),
    taxAmount: numeric("tax_amount").default("0"),
    grandTotal: numeric("grand_total").default("0"),
    terbilang: text("terbilang"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    status: text("status").default("DRAFT"),
}, (table) => {
    return {
        customerIdx: index("idx_invoices_customer").on(table.customerName),
        dateIdx: index("idx_invoices_date").on(table.invoiceDate),
    };
});

export const invoicesRelations = relations(invoices, ({ many }) => ({
    items: many(invoiceItems),
}));

// 2. Invoice Items Table
export const invoiceItems = pgTable("invoice_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
    rowNumber: integer("row_number").notNull(),
    date: date("date"),
    consignee: text("consignee"),
    vehicleNumber: text("vehicle_number"),
    containerNumber: text("container_number"),
    destination: text("destination"),
    depo: text("depo"),
    status: text("status"),
    size: text("size"),
    pickupLocation: text("pickup_location"),
    smartDepo: text("smart_depo"),
    emty: text("emty"),
    price: numeric("price").default("0"),
    gatePass: numeric("gate_pass").default("0"),
    liftOff: numeric("lift_off").default("0"),
    bongkar: numeric("bongkar").default("0"),
    perbaikan: numeric("perbaikan").default("0"),
    parkir: numeric("parkir").default("0"),
    pmp: numeric("pmp").default("0"),
    repair: numeric("repair").default("0"),
    ngemail: numeric("ngemail").default("0"),
    rsm: numeric("rsm").default("0"),
    cleaning: numeric("cleaning").default("0"),
    stuffing: numeric("stuffing").default("0"),
    storage: numeric("storage").default("0"),
    demurrage: numeric("demurrage").default("0"),
    seal: numeric("seal").default("0"),
    others: numeric("others").default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => {
    return {
        invoiceIdIdx: index("idx_items_invoice_id").on(table.invoiceId),
    };
});

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
    invoice: one(invoices, {
        fields: [invoiceItems.invoiceId],
        references: [invoices.id],
    }),
}));

// 3. Invoice Counters Table
export const invoiceCounters = pgTable("invoice_counters", {
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    lastSequence: integer("last_sequence").default(0),
}, (table) => {
    return {
        pk: uniqueIndex("invoice_counters_pk").on(table.year, table.month),
    };
});

// --- BETTER AUTH TABLES ---

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id)
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});
