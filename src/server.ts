import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'; // Loads .env variables
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';

const app = express();



// --- Global Middleware ---
app.use(cors({ origin: true, credentials: true })); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON request bodies
app.use(cookieParser()); // Parse cookies



// --- API Routes ---
app.use('/api/auth', authRoutes); // All auth routes 
app.use('/api/notes', notesRoutes); // All notes routes 



// A simple health check endpoint
app.post('/health', (_req, res) => res.json({ ok: true }));



// --- Start Server ---
const port = Number(process.env.PORT || 5001);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});