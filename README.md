🚀 Notes API Backend














A secure, scalable, and modern RESTful API for a multi-user Notes Application built with
Node.js, Express, TypeScript, and Drizzle ORM.
Includes JWT-based authentication, Google OAuth login, and full CRUD for notes.

🧭 Table of Contents

✨ Features

🧰 Tech Stack

⚙️ Setup & Installation

🔑 Google OAuth Setup

📡 API Endpoints

🧠 Additional Notes

📜 License

✨ Features
🔐 Authentication

✅ User Registration (Email/Password)
✅ User Login (Email/Password)
✅ Google OAuth 2.0 Integration
✅ Secure Password Hashing with bcryptjs

🛡 Authorization

🔸 Protected API routes via JWT
🔸 Access Token (15 min) & Refresh Token (7 days)
🔸 Token Refresh Endpoint /api/auth/refresh

🗒 Notes CRUD

🧾 Create, Read, Update, Delete notes
🔒 Multi-Tenancy — each user sees only their own data

🎁 Bonus Features

🔍 Search: /api/notes?q=keyword
📄 Pagination: /api/notes?page=1&limit=10

🧰 Tech Stack
Category	Tools
Language	TypeScript
Server	Node.js + Express.js
Database	PostgreSQL
ORM	Drizzle ORM
Validation	Zod
Authentication	JWT, bcryptjs, google-auth-library
Environment	dotenv
⚙️ Setup & Installation
1️⃣ Clone Repository
git clone https://github.com/chayanbain4/notes-api.git
cd notes-api

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the project root:

PORT=5001
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/notes_app"
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="http://localhost:5001/api/auth/google/callback"

4️⃣ Setup Database

Make sure PostgreSQL is running, then sync schema:

npm run drizzle:push

5️⃣ Start Development Server
npm run dev


Server runs at 👉 http://localhost:5001

🔑 Google OAuth Setup

Visit Google Cloud Console
.

Create new OAuth 2.0 credentials → Choose Web Application.

Add:

Authorized origin → http://localhost:5001

Authorized redirect URI → http://localhost:5001/api/auth/google/callback

Paste your CLIENT_ID and CLIENT_SECRET into .env.

📡 API Endpoints
🧍 Authentication Routes
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}


✅ Returns access & refresh tokens.

POST /api/auth/refresh
{
  "refreshToken": "PASTE_REFRESH_TOKEN_HERE"
}


➡️ Returns new access token.

GET /api/auth/google

Open in browser → redirects to Google Login & returns tokens.

🗒 Notes Routes

⚠️ All routes require Bearer Token Authorization
Authorization: Bearer <accessToken>

POST /api/notes

Create a new note:

{
  "title": "My First Note",
  "content": "This is the content for my note."
}

GET /api/notes

Fetch notes (with pagination/search):

GET /api/notes?page=1&limit=5&q=project

GET /api/notes/:id

Get a specific note by ID.

PATCH /api/notes/:id

Update note:

{
  "title": "Updated Note",
  "content": "Updated content"
}

DELETE /api/notes/:id

Delete note by ID.
Returns:

{ "message": "Note deleted successfully" }

🧠 Additional Notes

All passwords hashed via bcryptjs.

Zod used for runtime input validation.

Modular structure for scalability:

src/
├── controllers/
├── routes/
├── db/
├── validators/
├── utils/
└── server.ts

🧰 Scripts
Command	Description
npm run dev	Run server in dev mode (Nodemon)
npm run build	Compile TypeScript
npm run start	Run compiled server
npm run drizzle:push	Sync database schema
