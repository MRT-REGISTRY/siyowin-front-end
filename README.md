# Siyowin

This repository is organized as a full-stack project.

## Project Structure

- `Front-end/` - Next.js frontend application
- `Back-end/` - Backend application workspace

## Frontend

```powershell
cd Front-end
npm install
npm run typecheck
npm run build
npm run dev
```

## Backend

```powershell
cd Back-end
npm install
copy .env.example .env
npm run typecheck
npm run build
npm run dev
```

Use `npm run build` before deployment. `Front-end/.next`, `Back-end/dist`, `node_modules`, and TypeScript build-info files are generated artifacts and should not be committed.
