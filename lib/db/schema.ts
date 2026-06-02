import { boolean, index, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { StoreTemplate } from "@/lib/templater/schema";

export const templates = pgTable(
  "templates",
  {
    id: text("id").notNull(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    templateJson: jsonb("template_json").$type<StoreTemplate>().notNull(),
    shareEnabled: boolean("share_enabled").default(false).notNull(),
    shareId: text("share_id"),
    sharedAt: timestamp("shared_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.userId] }),
    index("templates_user_id_idx").on(table.userId),
    uniqueIndex("templates_share_id_idx").on(table.shareId),
  ],
);

export type TemplateRecord = typeof templates.$inferSelect;
