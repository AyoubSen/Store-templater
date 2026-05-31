import { index, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { StoreTemplate } from "@/lib/templater/schema";

export const templates = pgTable(
  "templates",
  {
    id: text("id").notNull(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    templateJson: jsonb("template_json").$type<StoreTemplate>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.userId] }),
    index("templates_user_id_idx").on(table.userId),
  ],
);

export type TemplateRecord = typeof templates.$inferSelect;
