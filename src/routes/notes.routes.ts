import { Router } from "express";
import { requireAuth } from "../middleware/auth"; 
import {
  createNote,
  listNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller"; 

const router = Router();



// --- RESTful Notes API ---

// POST /api/notes
router.post("/", requireAuth, createNote);

// GET /api/notes
router.get("/", requireAuth, listNotes);

// GET /api/notes/:id
router.get("/:id", requireAuth, getNote);

// PATCH /api/notes/:id
router.patch("/:id", requireAuth, updateNote);

// DELETE /api/notes/:id
router.delete("/:id", requireAuth, deleteNote);

export default router;