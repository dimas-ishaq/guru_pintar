# AI Teacher Admin Platform - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/guru_pintar
OPENAI_API_KEY=sk-your-openai-api-key
JWT_SECRET=your-secure-secret-key
PORT=3000
```

### 3. Setup Database
```bash
# Generate migration
bun run drizzle-kit generate

# Push schema to database
bun run drizzle-kit push
```

### 4. Run Development Server
```bash
# Run API server
cd apps/api
bun run dev

# Run Web frontend (in another terminal)
cd apps/web
bun run dev
```

## Project Structure

```
guru_pintar/
├── apps/
│   ├── api/              # Hono backend API
│   │   ├── src/
│   │   │   ├── routes/   # API routes
│   │   │   ├── services/ # Business logic
│   │   │   ├── middlewares/ # Auth & other middlewares
│   │   │   ├── db.ts     # Database connection
│   │   │   ├── index.ts  # App entry
│   │   │   └── server.ts # Server startup
│   │   └── package.json
│   └── web/              # Alpine.js frontend
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── packages/
│   ├── ai/               # AI generation module
│   ├── types/            # Shared types & schemas
│   └── utils/            # Utility functions
├── drizzle.config.ts     # Drizzle ORM config
├── tsconfig.json         # TypeScript config
└── package.json          # Root workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents
- `POST /api/documents/generate-prota` - Generate PROTA
- `POST /api/documents/generate-prosem` - Generate PROSEM
- `POST /api/documents/generate-modul-ajar` - Generate Modul Ajar
- `POST /api/documents/generate-kktp` - Generate KKTP
- `GET /api/documents/list/:userId` - List user documents

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/report/:userId` - Get attendance report

## Tech Stack

- **Runtime**: Bun
- **Backend**: Hono
- **Frontend**: Alpine.js + TailwindCSS
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI API
- **Auth**: JWT

## Development

### Run Tests
```bash
bun test
```

### Build for Production
```bash
bun run build
```

### Start Production Server
```bash
bun run start
```
