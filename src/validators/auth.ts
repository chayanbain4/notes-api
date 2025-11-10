import { z } from 'zod';


/**
 * Schema for validating new user registration.
 * Requires name, a valid email, and a password of at least 6 characters.
 */
export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});




/**
 * Schema for validating user login.
 * Requires a valid email and a password.
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});