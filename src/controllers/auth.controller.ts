// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { registerSchema, loginSchema } from "../validators/auth";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

/**
 * Handles new user registration.
 * Route: POST /api/auth/register
 */
export async function register(req: Request, res: Response) {
  // Validate input
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.issues,
    });
  }

  const { name, email, password } = parsed.data;

  try {
    // Check if user already exists
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ name, email, password: hash }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    console.error("Register error:", err?.code, err?.message);
    if (err?.code === "23505") return res.status(409).json({ message: "Email already registered" });
    return res.status(500).json({ message: "Internal error during registration" });
  }
}

/**
 * Handles user login with email and password.
 * Route: POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  // Validate input
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.issues,
    });
  }

  const { email, password } = parsed.data;

  try {
    // Find user by email
    const [found] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Check if user exists and has a password
    if (!found || !found.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const ok = await bcrypt.compare(password, found.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign and return access + refresh tokens
    const accessToken = signAccessToken({ sub: found.id, email: found.email });
    const refreshToken = signRefreshToken({ sub: found.id });

    // Save the refresh token to the database
    await db.update(users)
      .set({ refreshToken })
      .where(eq(users.id, found.id));
    
    return res.json({ message: "Login successful", accessToken, refreshToken });

  } catch (err: any) {
    console.error("Login error:", err?.code, err?.message);
    return res.status(500).json({ message: "Internal error during login" });
  }
}

// --- 3. Google OAuth ---

// Initialize Google OAuth client
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
const oauth = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URI,
});

/**
 * (Web Flow) Redirects the user to Google's login page.
 * Route: GET /api/auth/google
 */
export async function googleStart(_req: Request, res: Response) {
  const url = oauth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "email", "profile"],
  });
  return res.redirect(url);
}

/**
 * (Web Flow) Handles the callback from Google.
 * Route: GET /api/auth/google/callback
 */
export async function googleCallback(req: Request, res: Response) {
  try {
    // Get code from Google and exchange for tokens
    const code = req.query.code as string | undefined;
    if (!code) return res.status(400).json({ message: "Missing code" });

    const { tokens } = await oauth.getToken(code);
    if (!tokens.id_token) return res.status(400).json({ message: "No id_token returned from Google" });

    // Verify token and get user profile
    const ticket = await oauth.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Unable to extract Google profile" });

    const email = payload.email;
    const name = payload.name ?? email.split("@")[0];

    // Find or create user
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

    let userId: number;
    if (existing) {
      userId = existing.id;
    } else {
      const [inserted] = await db
        .insert(users)
        .values({ name, email, password: null }) // null password for OAuth user
        .returning({ id: users.id });
userId = inserted.id;
    }

    // Sign and return tokens
    const accessToken = signAccessToken({ sub: userId, email });
    const refreshToken = signRefreshToken({ sub: userId });

    await db.update(users)
      .set({ refreshToken })
      .where(eq(users.id, userId));
    
    return res.json({ message: "Google login successful", user: { id: userId, name, email }, accessToken, refreshToken });

  } catch (e) {
    console.error("Google OAuth error:", e);
    return res.status(500).json({ message: "Google OAuth error" });
  }
}

/**
 * (Mobile/SPA Flow) Logs in a user via a Google ID Token.
 * Route: POST /api/auth/google/idtoken
 */
export async function googleLoginWithIdToken(req: Request, res: Response) {
  try {
    // Get id_token from client
    const { id_token } = req.body as { id_token?: string };
    if (!id_token) return res.status(400).json({ message: "Missing id_token" });

    // Verify token and get user profile
    const ticket = await oauth.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Invalid Google token" });

    const email = payload.email;
    const name = payload.name ?? email.split("@")[0];

    // Find or create user
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

    let userId: number;
    if (existing) {
      userId = existing.id;
    } else {
      const [inserted] = await db.insert(users).values({ name, email, password: null }).returning({ id: users.id });
userId = inserted.id;
    }

    // Sign and return tokens
    const accessToken = signAccessToken({ sub: userId, email });
    const refreshToken = signRefreshToken({ sub: userId });

    await db.update(users)
      .set({ refreshToken })
      .where(eq(users.id, userId));

    return res.json({ message: "Google login successful", user: { id: userId, name, email }, accessToken, refreshToken });
    
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: "Invalid Google id_token" });
  }
}

/**
 * Issues a new Access Token using a valid Refresh Token.
 * Route: POST /api/auth/refresh
 */
export async function refreshAccessToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" });
    }

    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Find user and check if refresh token is valid
    const [user] = await db
      .select({ id: users.id, email: users.email, dbToken: users.refreshToken })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || user.dbToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token is invalid or has been revoked" });
    }

    // Issue a new access token
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    return res.json({ accessToken });

  } catch (err: any) {
    console.error("Refresh token error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}