// src/controllers/notes.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { notes } from "../db/schema";
import { and, eq, ilike, count } from "drizzle-orm";




// Custom Request type with authenticated user
type AuthedRequest = Request & { user?: { id: number; email: string } };

// --- Zod Schemas ---
const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});






/**
 * Creates a new note for the authenticated user.
 * Route: POST /api/notes
 */
export async function createNote(req: AuthedRequest, res: Response) {
  try {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    }
    const userId = req.user!.id;

    const [inserted] = await db
      .insert(notes)
      .values({ title: parsed.data.title, content: parsed.data.content, userId })
      .returning();

    return res.status(201).json({ message: "Note created", note: inserted });
  } catch (err: any) {
    console.error("Create note error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}







/**
 *
 * Lists all notes for the user, with pagination and search.
 * Query Params: ?page=1 & ?limit=10 & ?q=searchterm
 * Route: GET /api/notes
 */
export async function listNotes(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user!.id;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Search
    const searchQuery = (req.query.q as string) || "";

    // Dynamic query clause
    const whereClause = and(
      eq(notes.userId, userId),
      searchQuery
        ? ilike(notes.title, `%${searchQuery}%`)
        : undefined
    );

    // Run queries in parallel for data and total count
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(notes)
        .where(whereClause)
        .orderBy(notes.id)
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(notes)
        .where(whereClause)
    ]);
    
    const totalNotes = totalResult[0].total;
    const totalPages = Math.ceil(totalNotes / limit);

    return res.json({
      notes: rows,
      meta: {
        page,
        limit,
        totalNotes,
        totalPages,
      },
    });

  } catch (err: any) {
    console.error("List notes error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}








/**
 * Gets a single note by ID for the authenticated user.
 * Route: GET /api/notes/:id
 */
export async function getNote(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const [row] = await db.select().from(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
    
    if (!row) return res.status(404).json({ message: "Note not found" });
    return res.json({ note: row });
  } catch (err: any) {
    console.error("Get note error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}









/**
 * Updates a specific note by ID for the authenticated user.
 * Route: PATCH /api/notes/:id
 */
export async function updateNote(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const parsed = updateNoteSchema.safeParse(req.body);

    if (!parsed.success || (!parsed.data.title && !parsed.data.content)) {
      return res.status(400).json({ message: "Nothing to update", errors: parsed.success ? undefined : parsed.error.flatten() });
    }

    // Check if the note exists and belongs to the user
    const [exists] = await db.select({ id: notes.id }).from(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
    if (!exists) return res.status(404).json({ message: "Note not found" });

    // Update the note
    const [updated] = await db
      .update(notes)
      .set({ ...parsed.data })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();

    return res.json({ message: "Note updated", note: updated });
  } catch (err: any) {
    console.error("Update note error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}









/**
 * Deletes a specific note by ID for the authenticated user.
 * Route: DELETE /api/notes/:id
 */
export async function deleteNote(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    // Check if the note exists and belongs to the user
    const [exists] = await db.select({ id: notes.id }).from(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
    if (!exists) return res.status(404).json({ message: "Note not found" });

    // Delete the note
    await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return res.json({ message: "Note deleted" });
  } catch (err: any) {
    console.error("Delete note error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}