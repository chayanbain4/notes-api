// src/db/schema.ts
import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";




/**
 * Defines the 'users' table.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // Can be null for users who sign in with Google
  // Stores the long-lived refresh token
  refreshToken: varchar("refresh_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});





/**
 * Defines the 'notes' table.
 */
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: varchar("content", { length: 4000 }).notNull(),
  // This is the foreign key that links a note to a user.
  userId: integer("user_id").notNull().references(() => users.id, {
    onDelete: "cascade" // If a user is deleted, all their notes are also deleted.
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});








/**
 * (Optional) Defines the relationships for Drizzle's relational queries.
 * This tells Drizzle that one user can have 'many' notes.
 */
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));