# Free Deployment Guide

This project can be deployed for $0 using:

- Frontend: Vercel Hobby
- Backend API: Render Free Web Service
- Database: Neon Free Postgres

This combination fits the current codebase well:

- `frontend/` is a Vite React app
- `backend/` is a Node/Express API
- the backend uses PostgreSQL

## 1. Push the repo to GitHub

All three services work best from a GitHub repository.

## 2. Create a free Postgres database

Recommended: Neon Free

After creating the database:

- copy the connection string
- keep it as `DATABASE_URL`

Then run the SQL from:

- `database/schema.sql`
- `database/seed.sql` if you want starter data

You can paste those files into the Neon SQL editor or import them with `psql`.

## 3. Deploy the backend on Render

You can either:

- create a new Web Service from the `backend` folder, or
- import the included root-level `render.yaml` Blueprint

Suggested settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health check path: `/health`
- Blueprint option: `render.yaml` already includes the backend service config

Environment variables:

- `DATABASE_URL`: your Neon connection string
- `JWT_SECRET`: a long random secret
- `PORT`: `10000`
- `NODE_ENV`: `production`

Health check path:

- `/health`

After deploy, your backend URL will look like:

- `https://your-backend-name.onrender.com`

Your API base URL will be:

- `https://your-backend-name.onrender.com/api`

## 4. Deploy the frontend on Vercel

Create a new Vercel project from the `frontend` folder.

Suggested settings:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- SPA rewrite: already included in `frontend/vercel.json`

Environment variable:

- `VITE_API_URL`: `https://your-backend-name.onrender.com/api`

## 5. Verify the app

After both deploys:

- open the frontend URL
- test login and register
- test profile create/update
- confirm the frontend can reach the backend

## Important free-tier limits

- Render free web services sleep after inactivity and may take time to wake up.
- Render free Postgres expires after 30 days, so use Neon instead for the database.
- Vercel Hobby is best for personal or hobby use.

## Optional alternative

If you prefer one frontend platform only:

- Netlify Free can also host the frontend
- keep Render + Neon for backend and database
