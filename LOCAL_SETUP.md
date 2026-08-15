# Local Setup — Credentials, Run & Build

## URLs

| App | URL |
|-----|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API base (frontend `.env`) | http://localhost:8000/api |
| Health check | http://localhost:8000/api/status |

Vendor area after login: http://localhost:5173/vendor

---

## Demo credentials

Seeded by `backend/database/seeders/DatabaseSeeder.php`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@lyzo.com` | `Admin@12345` |
| Vendor | `vendor@lyzo.com` | `Vendor@12345` |
| Customer | `customer@lyzo.com` | `Customer@12345` |

---

## Prerequisites

- PHP 8.2+ with Composer
- Node.js 20+ with npm
- PostgreSQL (matches `backend/.env.example`)

---

## First-time setup

### Backend

```powershell
cd backend
copy .env.example .env
# Edit .env: set DB_* and generate key if needed
php artisan key:generate
composer install
php artisan migrate --seed
```

### Frontend

```powershell
cd frontend
copy .env.example .env
# Ensure VITE_API_BASE_URL=http://localhost:8000/api
npm install
```

---

## Run (development)

Open two terminals.

**Backend**

```powershell
cd backend
php artisan serve
```

Serves at http://localhost:8000

**Frontend**

```powershell
cd frontend
npm run dev
```

Serves at http://localhost:5173

---

## Build (production)

**Backend** (Laravel — no separate frontend build step in `backend/`):

```powershell
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Serve with your web server (or `php artisan serve` for a quick check).

**Frontend**

```powershell
cd frontend
npm run build
```

Output is in `frontend/dist/`. Preview locally:

```powershell
npm run preview
```

---

## Quick smoke checks

1. Open http://localhost:8000/api/status — should return `"status":"ok"`.
2. Open http://localhost:5173/login.
3. Sign in as `vendor@lyzo.com` / `Vendor@12345` — should land on the vendor dashboard.
