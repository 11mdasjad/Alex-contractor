import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  data: text("data").notNull(),
  files: text("files").notNull(),
  createdAt: integer("created_at").notNull(),
  status: text("status").notNull().default("new"),
});
export const content = sqliteTable("content", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  slug: text("slug").notNull(),
  data: text("data").notNull(),
  published: integer("published").notNull().default(0),
  updatedAt: integer("updated_at").notNull(),
});
export const audit = sqliteTable("audit", {
  id: text("id").primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  record: text("record").notNull(),
  createdAt: integer("created_at").notNull(),
});
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
});
