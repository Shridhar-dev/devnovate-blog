# Devnovate - MERN Blogging Platform (Black & White)

Minimalist, black-and-white blogging platform with user submissions and admin approval.

## Tech
- Backend: Express + MongoDB Atlas + JWT
- Frontend: React (Vite)
- Deploy: Netlify (frontend), Render/Heroku (backend)

## Setup

1) Backend
- Copy backend/.env.example to backend/.env and fill:
  - PORT, MONGO_URI, JWT_SECRET, CORS_ORIGIN, ADMIN_EMAILS
- Install & run:
  - cd backend
  - npm install
  - npm run dev

2) Frontend
- Create frontend/.env with:
  - VITE_API_URL="http://localhost:5000/api"
- Install & run:
  - cd frontend
  - npm install
  - npm run dev

## Deploy
- Backend (Render/Heroku):
  - Set environment variables same as .env
  - Ensure Procfile exists (web: node src/server.js)
- Frontend (Netlify):
  - Set build command: npm run build
  - Publish directory: dist
  - Environment VITE_API_URL = https://your-backend.onrender.com/api

## Admin
- Any email in ADMIN_EMAILS (comma-separated) becomes admin on signup.
- Admin dashboard at /admin.
