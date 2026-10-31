# JustRefer — Loan Referral Platform

A pixel-accurate implementation of the JustRefer marketing landing page and partner dashboard.

## Tech Stack
- **Frontend**: Vanilla TypeScript (strict mode), HTML5, hand-written CSS with BEM methodology and CSS Custom Properties. Zero UI component libraries (no React, Vue, Tailwind, or Bootstrap).
- **Backend**: Node.js (v20+), Express 4, TypeScript, Zod validation, Helmet, Morgan, Compression, CORS, Vitest.
- **Shared Types**: Strict TypeScript contracts in `shared/types.ts`.

---

## Directory Structure
```
├── shared/
│   └── types.ts             # Shared data contracts between client & server
├── client/
│   ├── index.html           # Public landing page (Page A)
│   ├── dashboard.html       # Partner dashboard (Page B)
│   ├── vite.config.ts       # Vite bundler & dev proxy (/api -> :3000)
│   └── src/
│       ├── styles/          # Hand-written CSS (tokens, base, component styles)
│       ├── components/      # Modular TS components (topbar, hero, dashboard, etc.)
│       ├── data/            # Typed marketing fallback constants
│       ├── api/             # Typed API client wrapper
│       ├── icons.ts         # Inline SVG line icons (24px grid, stroke 1.75)
│       └── main.ts          # Page orchestrator & router
├── server/
│   ├── .env.example         # Environment variable documentation
│   ├── src/
│   │   ├── index.ts         # Express server entry point
│   │   ├── app.ts           # App setup, security middlewares, static asset serving
│   │   ├── routes/          # Express route handlers
│   │   ├── services/        # Business logic & commission calculation
│   │   ├── repo/            # In-memory repository implementations
│   │   ├── middleware/      # requireUser and errorHandler
│   │   └── data/            # Seed data
│   └── vitest.config.ts     # Vitest configuration for unit tests
└── package.json             # Root unified scripts
```

---

## Environment Variables (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port for Express backend server | `3000` |
| `CLIENT_ORIGIN` | Allowed CORS origin for Vite dev server | `http://localhost:5173` |
| `SESSION_SECRET` | Secret key for session management | `development_session_secret_change_in_production` |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Run in Development Mode
Starts both the Express API server (port 3000) and the Vite development client (port 5173) concurrently:
```bash
npm run dev
```
- Open Public Website: `http://localhost:5173/`
- Open Partner Dashboard: `http://localhost:5173/dashboard`

### 3. Run Production Build & Server
```bash
npm run build
npm start
```
Express will serve both the `/api/*` endpoints and the production client bundle at `http://localhost:3000`.

### 4. Run Unit Tests & Quality Checks
```bash
npm test         # Run Vitest unit tests (commission calculation & filter mapping)
npm run typecheck # Strict TypeScript checking across client & server
npm run lint      # Code linting
```

---

## API Endpoints

All JSON endpoints reside under `/api`:

| Method | Path | Purpose | Notes |
|---|---|---|---|
| `GET` | `/api/health` | Liveness check | Returns `{ ok: true }` |
| `GET` | `/api/me` | Current user profile | Returns seeded user (`Ayush`, `7458824515`, `JR-AYUS7175`, `admin`) |
| `GET` | `/api/products` | Loan products | Home Loan (0.3%), LAP (0.5%), Personal Loan (1.0%), Business Loan (1.0%) |
| `GET` | `/api/dashboard/summary` | Dashboard metrics & chart series | Query param `range` (1W, 1M, 3M, 6M, FY, ALL). New users start with 0. |
| `GET` | `/api/referrals` | Referral list & counts | Supports `status` (`all`, `pending`, `approved`), pagination, and status counts |
| `POST` | `/api/referrals` | Submit loan referral | Validates with Zod, calculates commission automatically, sets `in_login` status |
| `GET` | `/api/settlements/latest` | Settlement details | UTR CMS8892109420, ₹1,32,500.00, 4 breakdown rows |
| `GET` | `/api/partners` | Verified partners marquee | 9 partner profiles across India |
| `GET` | `/api/faqs` | FAQ list | 7 questions with placeholder answer text |

---

## Content Notes & TDS Flag
> [!NOTE]
> **TDS Wording Flag**: In section 2.2, the Next Payout preview card states `"Zero TDS Deducted"`, whereas in section 2.5, the Settlement Card footer states `"Section 194H Compliant • Official TDS Certificate"`. As instructed by the specification (Section 7), both phrases have been preserved verbatim. Product owners can clarify whether TDS exemption or 194H deduction applies to partner payouts.
