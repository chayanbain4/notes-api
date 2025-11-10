A secure and modern RESTful API for a multi-user Notes Application built using
Node.js + Express + TypeScript + Drizzle ORM + PostgreSQL.

This backend supports user authentication (local & Google OAuth),
JWT-based authorization, and a complete CRUD Notes API
with advanced features like pagination and search.

It’s built to demonstrate real-world backend architecture,
including clean code practices, TypeScript safety, and robust validation.

🖼️ Project Preview

(Optional: replace below image with your project’s architecture or Swagger screenshot)

📑 Table of Contents

✨ Features

💻 Technology Stack

⚙️ Setup and Installation

🧩 Environment Variables

🔑 Google OAuth Setup

📡 API Endpoints

🧠 Additional Notes

🧰 Scripts

📝 License

✨ Features
🔐 Authentication

User Registration (Email & Password)

User Login (Email & Password)

Google OAuth 2.0 Integration

Secure Password Hashing using bcryptjs

🛡️ Authorization

Protected API routes using JWT

Access Token (15 min) + Refresh Token (7 days)

/api/auth/refresh for token renewal

🗒️ Notes CRUD

Create, Read, Update, Delete your own notes

Strict user isolation (each user sees only their own notes)

🎯 Advanced

Pagination: /api/notes?page=1&limit=10

Search: /api/notes?q=meeting

Type-safe validation with Zod

💻 Technology Stack
Layer	Tools / Libraries
Language	TypeScript
Server Framework	Express.js
Database	PostgreSQL
ORM	Drizzle ORM
Validation	Zod
Authentication	JWT, bcryptjs, google-auth-library
Environment	dotenv
Runtime	Node.js 18+
⚙️ Setup and Installation
1️⃣ Clone the Repository
git clone <your-repo-url>
cd notes-api

2️⃣ Install Dependencies
npm install

3️⃣ Create a .env File

Follow the Environment Variables
 section below to set up credentials.

4️⃣ Set Up the Database

Make sure PostgreSQL is running and a database (e.g., notes_app) exists.
Then run:

npm run drizzle:push


This creates all tables (users, notes, etc.) defined in your schema.

5️⃣ Run the Server
npm run dev


Server starts at:
➡️ http://localhost:5001

🧩 Environment Variables
# Server Configuration
PORT=5001

# PostgreSQL Database URL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/notes_app"

# JWT Secrets
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="http://localhost:5001/api/auth/google/callback"

🔑 Google OAuth Setup

Go to Google Cloud Console
.

Create a new project → Navigate to APIs & Services → Credentials.

Choose OAuth client ID → Select Web application.

Add:

Authorized JavaScript origins: http://localhost:5001

Authorized redirect URI: http://localhost:5001/api/auth/google/callback

Copy the credentials into your .env file.

📡 API Endpoints

Use Postman or Thunder Client to test the following routes.
Protected routes require an Authorization: Bearer <accessToken> header.

🧍 Authentication Routes
POST /api/auth/register

Create a new user.

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}

POST /api/auth/login

Authenticate a user and receive tokens.

{
  "email": "john@example.com",
  "password": "secret123"
}


Response:

{
  "message": "Login successful",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}

GET /api/auth/google

Open in browser to start Google login flow.

POST /api/auth/refresh

Use a refresh token to get a new access token.

{
  "refreshToken": "your-refresh-token"
}

🗒️ Notes Routes
POST /api/notes

Create a new note.

{
  "title": "My First Note",
  "content": "Hello, this is my note."
}

GET /api/notes

Retrieve all user notes with optional pagination or search.
Example:

GET /api/notes?page=1&limit=5&q=project


Response:

{
  "notes": [
    { "id": 1, "title": "Project Notes", "content": "..." }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "totalNotes": 1,
    "totalPages": 1
  }
}

GET /api/notes/:id

Get a note by ID.

PATCH /api/notes/:id

Update a note.

{
  "title": "Updated Note",
  "content": "Updated content"
}

DELETE /api/notes/:id

Delete a note by ID.

🧠 Additional Notes

Passwords are hashed with bcryptjs

JWTs are signed securely and validated on each request

Zod validates all incoming payloads

The project follows MVC folder structure:

src/
├── controllers/
├── routes/
├── db/
├── validators/
├── utils/
└── server.ts

🧰 Scripts
Command	Description
npm run dev	Start development server with Nodemon
npm run build	Compile TypeScript to JavaScript
npm run start	Run compiled server
npm run drizzle:push	Sync database schema
