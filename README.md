# MSG91 WhatsApp Chatbot + Admin Dashboard
This project contains a simple WhatsApp chatbot backend (Node.js + Express + MongoDB) and a React admin dashboard (Vite + Tailwind) that displays submissions in a simple table view.

## Setup
1. Copy `backend/.env.example` to `backend/.env` and fill variables (use MongoDB Atlas connection string).
2. Install backend:
   ```
   cd backend
   npm install
   ```
3. Install frontend:
   ```
   cd frontend
   npm install
   ```
4. Run backend (dev):
   ```
   cd backend
   npm run dev
   ```
5. Run frontend (dev):
   ```
   cd frontend
   npm run dev
   ```

## Notes
- This build uses placeholders for MSG91 credentials. Replace them in `backend/.env`.
- For production, build the frontend and copy `frontend/dist` to `backend/public`.
