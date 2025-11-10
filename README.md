🚀 Notes API Backend

A secure, scalable, and modern RESTful API for a multi-user Notes application.
Built with Node.js, Express, TypeScript, and Drizzle ORM, this backend demonstrates clean architecture, authentication, and real-world production readiness.

It includes:

Full user authentication (Email/Password + Google OAuth)

Protected CRUD endpoints for managing notes

Bonus features: pagination, search, and JWT-based Access/Refresh Tokens.

✨ Features
🔐 Authentication

User Registration (Email/Password)

User Login (Email/Password)

Google OAuth 2.0 Integration

Secure Password Hashing using bcryptjs

🛡️ Authorization

Protected API routes using JWT (JSON Web Tokens)

Secure Access Token (15 minutes) & Refresh Token (7 days) system

Refresh endpoint: /api/auth/refresh

🗒️ Notes Management

Create, Read, Update, and Delete notes

Strict Multi-Tenancy: Each user only sees their own notes

🎯 Additional Features

Pagination: GET /api/notes?page=...&limit=...

Search: GET /api/notes?q=... (search by note titles)

💻 Technology Stack
Category	Tools / Libraries
Server	Node.js, Express.js
Language	TypeScript
Database	PostgreSQL
ORM	Drizzle ORM
Validation	Zod
Authentication	jsonwebtoken, bcryptjs, google-auth-library
Environment Management	dotenv
⚙️ Setup and Installation

Follow these steps to run the project locally:

1️⃣ Clone the Repository
git clone <your-repo-url>
cd notes-api

2️⃣ Install Dependencies
npm install

3️⃣ Create Environment Variables

Create a .env file in the root directory and configure the following:

# Server Port
PORT=5001

# PostgreSQL Database URL
DATABASE_URL="postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5432/YOUR_DB_NAME"

# JWT Secrets (use strong random strings)
JWT_SECRET="your-short-secret-key-for-access-tokens"
JWT_REFRESH_SECRET="your-very-long-and-secure-secret-key-for-refresh-tokens"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="http://localhost:5001/api/auth/google/callback"

4️⃣ Initialize the Database

This project uses Drizzle ORM for schema management.

Create a new PostgreSQL database (e.g. notes_app).

Run the following command to sync schema:

npm run drizzle:push


This creates all tables (users, notes, etc.) automatically.

5️⃣ Start the Development Server
npm run dev


Your API will run at:
👉 http://localhost:5001

🔑 Google OAuth Setup

To enable Google Login:

Visit Google Cloud Console
.

Create a New Project.

Go to Credentials → Create Credentials → OAuth Client ID.

Choose Web Application.

Add:

Authorized JavaScript origin: http://localhost:5001

Authorized redirect URI: http://localhost:5001/api/auth/google/callback

Copy the Client ID and Client Secret into your .env.

📡 API Endpoints

Use Postman or any API testing tool to verify endpoints.

🧍 Authentication Routes
POST /api/auth/register

Register a new user.

Body:

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

POST /api/auth/login

Authenticate a user and get JWT tokens.

Body:

{
  "email": "test@example.com",
  "password": "password123"
}


Response (200):

{
  "message": "Login successful",
  "accessToken": "eyJhbGciOi... (15-min token)",
  "refreshToken": "eyJhbGciOi... (7-day token)"
}

GET /api/auth/google

Usage: Open this link in a browser, not Postman.

Redirects to Google login and returns user tokens on success.

http://localhost:5001/api/auth/google

POST /api/auth/refresh

Use a valid refresh token to get a new access token.

Body:

{
  "refreshToken": "PASTE_YOUR_REFRESH_TOKEN_HERE"
}


Response (200):

{
  "accessToken": "eyJhbGciOi... (new 15-min token)"
}

🗒️ Notes API Routes

⚠️ All Notes routes are protected.
Include your access token as a Bearer token in the Authorization header.

Authorization: Bearer <your-access-token>

POST /api/notes

Create a new note.

Body:

{
  "title": "My First Note",
  "content": "This is the content for my note."
}

GET /api/notes

Fetch all notes belonging to the logged-in user.

Optional Query Params:

?page=1 — select page

?limit=10 — items per page

?q=project — search keyword

Example:

GET http://localhost:5001/api/notes?page=1&limit=5&q=project


Response (200):

{
  "notes": [
    { "id": 1, "title": "Note about project", "content": "..." }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "totalNotes": 1,
    "totalPages": 1
  }
}

GET /api/notes/:id

Retrieve a single note by its ID.
Example:

GET /api/notes/1

PATCH /api/notes/:id

Update an existing note.

Body:

{
  "title": "Updated Note Title",
  "content": "Updated note content."
}

DELETE /api/notes/:id

Delete a note by its ID.
Example:

DELETE /api/notes/1


Response (200):

{
  "message": "Note deleted successfully"
}

🧠 Additional Notes

Passwords are hashed before saving using bcryptjs.

JWT tokens have defined expiration and rotation policy.

Schema and models are strongly typed via TypeScript.

Input validation handled through Zod.

Project structured in clean modular layers:

src/
├── controllers/
├── routes/
├── db/
├── validators/
├── utils/
└── server.ts

🧰 Useful Scripts
Command	Description
npm run dev	Run development server with hot reload
npm run build	Compile TypeScript
npm run start	Start compiled server
npm run drizzle:push	Sync database schema to PostgreSQL
