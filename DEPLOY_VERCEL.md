# Deploy LMS on Vercel

This app uses **two Vercel projects** (frontend + API) and **PostgreSQL** (SQLite does not work on Vercel serverless).

## 1. Database (PostgreSQL)

1. Create a free database at [Neon](https://neon.tech) or use **Vercel Postgres** in the dashboard.
2. Copy the connection string (`postgresql://...?sslmode=require`).

## 2. Deploy the API (backend)

1. Push this repo to GitHub.
2. [Vercel → New Project](https://vercel.com/new) → import the repo.
3. **Root Directory:** `backend`
4. Framework Preset: **Other**
5. **Environment variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `JWT_ACCESS_SECRET` | Long random string |
   | `JWT_REFRESH_SECRET` | Different long random string |
   | `FRONTEND_URL` | `https://YOUR-FRONTEND.vercel.app` (set after step 3) |
   | `NODE_ENV` | `production` |

6. Deploy. Note the API URL, e.g. `https://lms-api-xxx.vercel.app`.
7. **Seed production data** (once), from your machine:

   ```bash
   cd backend
   set DATABASE_URL=postgresql://...
   npx prisma migrate deploy
   npx prisma db seed
   ```

   Demo login after seed: `demo@lms.com` / `password123`

## 3. Deploy the frontend

1. New Vercel project → same repo.
2. **Root Directory:** `frontend`
3. Framework: **Next.js** (auto-detected).
4. **Environment variables:**

   | Name | Value |
   |------|--------|
   | `BACKEND_URL` | `https://lms-api-xxx.vercel.app` (no trailing slash) |

   Do **not** set `NEXT_PUBLIC_API_URL` when using `BACKEND_URL` — the app calls `/api` on the same domain and Next.js proxies to the backend.

5. Deploy. Copy your frontend URL (e.g. `https://lms-xxx.vercel.app`).

## 4. Link frontend URL to the API

1. Open the **backend** project → Settings → Environment Variables.
2. Set `FRONTEND_URL` to your frontend URL (`https://lms-xxx.vercel.app`).
3. Redeploy the backend.

## 5. Verify

- `https://YOUR-FRONTEND.vercel.app` — home page
- `https://YOUR-BACKEND.vercel.app/api/health` — `{ "status": "OK" }`
- Log in on the frontend with the demo account (after seeding).

## Local development

1. Use PostgreSQL in `backend/.env` (`DATABASE_URL` from Neon).
2. Run `setup.bat` or `npx prisma migrate deploy && npx prisma db seed` in `backend`.
3. `start-backend.bat` and `start-frontend.bat`.

## Troubleshooting

- **Login works locally but not on Vercel:** Check `FRONTEND_URL`, `BACKEND_URL`, and that the DB is migrated and seeded.
- **CORS errors:** Set `FRONTEND_URL` on the backend; preview URLs on `*.vercel.app` are allowed by default.
- **401 on every request:** Run migrations and seed on the production `DATABASE_URL`.
