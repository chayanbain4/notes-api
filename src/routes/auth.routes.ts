// src/routes/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  googleStart,
  googleCallback,
  googleLoginWithIdToken,
  refreshAccessToken,
} from "../controllers/auth.controller";

const router = Router();




// Route for local email/password registration/login
router.post("/register", register);
router.post("/login", login);



// --- Google OAuth Routes ---
router.get("/google", googleStart);
router.get("/google/callback", googleCallback);
router.post("/google/idtoken", googleLoginWithIdToken);


// --- refresh ROUTE  ---
router.post("/refresh", refreshAccessToken);

export default router;