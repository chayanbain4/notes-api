// src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
// This is your original secret, now for Access Tokens
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET as string;
// We use a NEW secret for refresh tokens. Add this to your .env file!
const REFRESH_TOKEN_SECRET = (process.env.JWT_REFRESH_SECRET ?? (process.env.JWT_SECRET + "_refresh")) as string;
// Access Tokens are short-lived (15 minutes)
const ACCESS_EXPIRES_IN: SignOptions['expiresIn'] = '15m';
// Refresh Tokens are long-lived (7 days)
const REFRESH_EXPIRES_IN: SignOptions['expiresIn'] = '7d';




/**
 * Signs a short-lived Access Token.
 * Used for API authentication.
 */
export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}





/**
 * Signs a long-lived Refresh Token.
 * Used to get a new access token.
 */
export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}





/**
 * Verifies a Refresh Token.
 * Returns the payload if valid, or null if invalid.
 */
// src/utils/jwt.ts
// 

export function verifyRefreshToken(token: string) {
  try {
    // 1. Verify the token and cast as 'any' to bypass default types
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;

    // 2. Safely check if the payload is an object and has the numeric 'sub'
    if (typeof payload === 'object' && payload !== null && typeof payload.sub === 'number') {
      return { sub: payload.sub };
    }
    
    // 3. If not, the token is invalid
    return null;
  } catch (e) {
    // 4. If verification throws an error (e.g., expired), it's invalid
    return null;
  }
}