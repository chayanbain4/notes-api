Here is the complete README.md file, formatted with correct Markdown for easy reading.

🚀 Notes API Backend
This is a complete and secure RESTful API for a multi-user notes application. It was built as a solution to a developer assignment, demonstrating a modern backend stack with Node.js, Express, TypeScript, and Drizzle ORM.

The API includes full user authentication (local email/password, Google OAuth) and a complete set of protected CRUD endpoints for managing notes. It also includes bonus features like pagination, search, and a secure Access/Refresh Token system.

✨ Features
Authentication:

User Registration (Email/Password)

User Login (Email/Password)

Google OAuth 2.0 Integration

Secure Password Hashing with bcryptjs

Authorization:

Protected API routes using JSON Web Tokens (JWT).

Secure Access Token (15 min) and Refresh Token (7 day) system.

Token refresh endpoint (/api/auth/refresh).

Notes API (CRUD):

Create, Read, Update, and Delete notes.

Strict Multi-Tenancy: Users can only access their own notes.

Bonus Features:

Pagination: GET /api/notes supports ?page=... and ?limit=... query params.

Search: GET /api/notes supports a ?q=... param to search note titles.

💻 Technology Stack
Server: Node.js, Express.js

Language: TypeScript

Database: PostgreSQL

ORM: Drizzle ORM

Validation: Zod

Authentication: jsonwebtoken, bcryptjs, google-auth-library

Environment: dotenv

⚙️ Setup and Installation
Follow these steps to get the server running locally.

1. Clone the Repository
Bash

git clone <your-repo-url>
cd notes-api
2. Install Dependencies
Bash

npm install
3. Set Up Environment Variables
Create a file named .env in the root of the project and fill in your values.

.env Template:

Bash

# Server Port
PORT=5001

# PostgreSQL Database URL
DATABASE_URL="postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5432/YOUR_DB_NAME"

# JWT Secrets (Use strong, random strings)
JWT_SECRET="your-short-secret-key-for-access-tokens"
JWT_REFRESH_SECRET="your-very-long-and-secure-secret-key-for-refresh-tokens"

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="http://localhost:5001/api/auth/google/callback"
4. Set Up the Database
This project uses drizzle:push for simple database setup.

Make sure you have created your database in PostgreSQL (e.g., notes_app).

Run the drizzle:push command. This will read your src/db/schema.ts file and create all the tables (users, notes) and columns (including refreshToken) in your database.

Bash

npm run drizzle:push
5. Run the Application
Bash

npm run dev
The server will start on http://localhost:5001.

🔑 Google OAuth Setup
To test Google login, you must:

Go to the Google Cloud Console.

Create a new project.

Go to "Credentials" and "Create Credentials" > "OAuth client ID".

Select "Web application".

Add an "Authorized JavaScript origin": http://localhost:5001

Add an "Authorized redirect URI": http://localhost:5001/api/auth/google/callback

Copy the "Client ID" and "Client Secret" into your .env file.

📡 API Endpoints (How to Test)
Use Postman or a similar API client to test the endpoints.

Authentication
POST /api/auth/register
Creates a new user.

Body (JSON):

JSON

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
POST /api/auth/login
Logs in a user and returns their tokens.

Body (JSON):

JSON

{
  "email": "test@example.com",
  "password": "password123"
}
Success Response (200):

JSON

{
  "message": "Login successful",
  "accessToken": "ey... (15-minute token)",
  "refreshToken": "ey... (7-day token)"
}
GET /api/auth/google
Action: Do not use in Postman. Open this URL in your web browser. http://localhost:5001/api/auth/google

Result: It will redirect you to Google to log in, and then return your tokens.

POST /api/auth/refresh
Uses a valid refreshToken to get a new accessToken.

Body (JSON):

JSON

{
  "refreshToken": "PASTE_YOUR_REFRESH_TOKEN_HERE"
}
Success Response (200):

JSON

{
  "accessToken": "ey... (A new 15-minute token)"
}
Notes API
All Notes routes require an accessToken. In Postman, set this in the Authorization tab:

Type: Bearer Token

Token: PASTE_YOUR_accessToken_HERE

POST /api/notes
Creates a new note.

Body (JSON):

JSON

{
  "title": "My First Note",
  "content": "This is the content for my note."
}
GET /api/notes
Gets all notes for the logged-in user.

Query Params (Optional):

?page=1: Which page to get.

?limit=10: How many notes per page.

?q=project: Search query to filter by title.

Example Request: GET http://localhost:5001/api/notes?page=1&limit=5&q=project

Success Response (200):

JSON

{
  "notes": [
    { "id": 1, "title": "Note about project", ... }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "totalNotes": 1,
    "totalPages": 1
  }
}
GET /api/notes/:id
Gets a single note by its ID (e.g., /api/notes/1).

PATCH /api/notes/:id
Updates a note by its ID (e.g., /api/notes/1).

Body (JSON):

JSON

{
  "title": "My Updated Title",
  "content": "The content has been updated."
}
DELETE /api/notes/:id
Deletes a note by its ID (e.g., /api/notes/1).
