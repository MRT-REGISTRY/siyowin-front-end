# Siyowin Backend

Express + TypeScript API for the Siyowin frontend.

## Run Locally

```powershell
npm install
copy .env.example .env
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Demo Accounts

All demo accounts use password `password123`.

- `student@siyowin.lk`
- `teacher@siyowin.lk`
- `admin@siyowin.lk`
- `superadmin@siyowin.lk`

## Main Routes

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/student`
- `GET /api/dashboard/subjects`
- `GET /api/dashboard/subjects/:subjectId`
- `GET /api/dashboard/subjects/:subjectId/homework`
- `GET /api/dashboard/subjects/:subjectId/leaderboard`
- `GET /api/admin/meta`
- `GET /api/admin/students`
- `POST /api/admin/students`
- `GET /api/admin/teachers`
- `POST /api/admin/teachers`
- `GET /api/admin/marks`
- `POST /api/admin/marks`
- `DELETE /api/admin/marks`
- `POST /api/admin/marks/bulk`
