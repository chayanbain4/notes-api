import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';




/**
 * Custom Express Request interface that includes an optional 'user' property.
 */
export interface AuthRequest extends Request {
  user?: { id: number; email?: string };
}





/**
 * Express middleware to protect routes.
 * It checks for a valid JWT in the Authorization header.
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Get the 'Authorization' header
  const auth = req.headers.authorization || '';
  // Extract the token (e.g., "Bearer <token>")
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  // 1. If no token, deny access
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    // 2. Verify the token is valid (not expired, correct secret)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get the user ID from the token (your signJwt uses 'sub')
    const id = typeof payload.sub === 'number' ? payload.sub : payload.id;
    if (!id) return res.status(401).json({ message: 'Invalid token payload' });

    // 3. Attach the user's info to the request object
    req.user = { id, email: payload.email };
    
    // 4. Token is valid, allow the request to continue to the controller
    next();
  } catch {
    // 5. If verification fails (bad token, expired), deny access
    return res.status(401).json({ message: 'Invalid token' });
  }
}