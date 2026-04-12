# حياة الفريلانسر — Full-Stack App

## Stack
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + Zustand
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT (Bearer token)

## Project Structure
```
freelancer-life/
├── client/          # Vite + React frontend
├── server/          # Express + Prisma backend
├── .env.example
└── package.json     # Root monorepo (npm workspaces)
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL and JWT_SECRET
```

### 3. Set up database
```bash
# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Run development servers
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

## Default Credentials

| Role    | Email / Username | Password  |
|---------|-----------------|-----------|
| Admin   | `adham`         | `123456`  |
| Company | `gym@gold.com`  | `gym123`  |
| Company | `cafe@code.com` | `cafe123` |

## API Endpoints

| Method | Endpoint                       | Auth        |
|--------|--------------------------------|-------------|
| POST   | `/api/auth/login`              | Public      |
| POST   | `/api/auth/register`           | Public      |
| GET    | `/api/discounts`               | Public      |
| GET    | `/api/users/me`                | User        |
| PATCH  | `/api/users/me`                | User        |
| POST   | `/api/users/me/upgrade`        | User        |
| POST   | `/api/users/me/use-discount`   | User        |
| POST   | `/api/users/me/redeem`         | User        |
| GET    | `/api/admin/stats`             | Admin       |
| GET    | `/api/admin/users`             | Admin       |
| PATCH  | `/api/admin/users/:id/plan`    | Admin       |
| POST   | `/api/admin/users/:id/points`  | Admin       |
| GET    | `/api/companies/rewards`       | Authenticated |
| POST   | `/api/discounts/request`       | Company     |

## Production Deployment

**Frontend** → Vercel  
**Backend + DB** → Railway (set `DATABASE_URL` and `JWT_SECRET` env vars)

```bash
# Build
npm run build

# Start server
cd server && npm start
```
