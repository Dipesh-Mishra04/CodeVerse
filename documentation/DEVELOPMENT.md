# CodeVerse — Complete Development & File Management Guide

**Last Updated:** April 2026  
**Project Type:** Full-Stack EdTech SaaS (AI-Powered Competitive Coding Platform)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Tech Stack](#tech-stack)
4. [Environment Setup](#environment-setup)
5. [Running Services](#running-services)
6. [Architecture & Communication](#architecture--communication)
7. [Development Workflow](#development-workflow)
8. [Key Files & Responsibilities](#key-files--responsibilities)
9. [Common Development Tasks](#common-development-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**CodeVerse** is a unified EdTech platform combining:
- **Problem Practice** — LeetCode-style DSA problems with difficulty levels
- **Online Compiler** — Multi-language code execution (C, C++, Java, Python, JavaScript, Go)
- **Submission Judging** — Automated testing with hidden test cases
- **Analytics Dashboard** — Performance tracking with charts and heatmaps
- **AI Virtual Tutor** — Real-time hints, explanations, and learning guidance

### Core Features
✅ User authentication (Email, Google OAuth, GitHub OAuth)  
✅ Problem submission and judging with test case evaluation  
✅ Real-time code execution feedback via WebSocket  
✅ AI-powered tutoring with streaming responses  
✅ User performance analytics and leaderboard  
✅ Role-based access control (user, moderator, admin)  

---

## Directory Structure

### Root Level
```
CodeVerse1/
├── DEVELOPMENT.md          ← You are here
├── developer_guide.md       ← Quick setup reference
├── Roadmap.md              ← Complete platform specification
├── documentation/
│   └── files.md            ← Basic file notes
├── frontend/               ← Next.js frontend
├── backend-node/           ← Node.js/Express API server
├── judge0/                 ← Rails code execution engine
└── supabase/               ← Database migrations & config
```

### Frontend (`/frontend`) — Next.js 14 + TypeScript

**Purpose:** User-facing web application  
**Port:** 4000 (development)  
**Tech:** Next.js 14, React 19, Tailwind CSS, Monaco Editor, TanStack Query

```
frontend/
├── app/                    ← Next.js App Router (pages)
│   ├── layout.tsx          ← Root layout wrapper
│   ├── page.tsx            ← Home/landing page
│   ├── globals.css         ← Global styles
│   ├── api/                ← Next.js API routes (if any)
│   ├── auth/               ← Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── otp-verify/
│   ├── dashboard/          ← Main user dashboard
│   ├── problems/           ← Problem listing & solving
│   ├── editor/             ← Code editor page
│   ├── analytics/          ← Performance analytics
│   ├── leaderboard/        ← User rankings
│   ├── tutor/              ← AI tutor interface
│   ├── profile/            ← User profile page
│   └── admin/              ← Admin panel
├── components/             ← React components (reusable)
│   ├── dashboard/          ← Dashboard-specific components
│   ├── problems/           ← Problem-related components
│   ├── layout/             ← Layout wrappers (header, sidebar)
│   ├── ui/                 ← Primitive UI components (buttons, modals)
│   ├── theme/              ← Theme providers
│   ├── providers/          ← Global providers (Supabase, Query, Auth)
│   ├── Navbar.tsx          ← Top navigation
│   ├── Footer.tsx          ← Footer
│   └── Hero3D.tsx          ← 3D hero animations (Three.js)
├── lib/                    ← Utilities & helpers
│   ├── api.ts              ← Axios instance & API helpers
│   ├── auth.ts             ← Authentication utilities
│   ├── supabaseClient.ts   ← Supabase client initialization
│   ├── utils.ts            ← General utilities
│   └── mock-data.ts        ← Demo/test data
├── stores/                 ← Zustand state management
│   ├── editor-prefs.ts     ← Editor preferences (theme, font size)
│   └── theme-store.ts      ← Theme state (dark/light mode)
├── types/                  ← TypeScript type definitions
│   └── index.ts            ← Centralized types
├── public/                 ← Static assets (images, fonts)
├── package.json            ← Dependencies
├── tsconfig.json           ← TypeScript config (strict mode)
├── next.config.ts          ← Next.js configuration
├── tailwind.config.js      ← Tailwind CSS config
├── postcss.config.mjs      ← PostCSS config
├── eslint.config.mjs       ← ESLint rules
├── proxy.ts                ← API proxy configuration
└── README.md               ← Frontend-specific documentation
```

**Key Frontend Files:**
- `components/Navbar.tsx` — Navigation header
- `app/problems/page.tsx` — Problem list view
- `components/problems/Editor.tsx` — Code editor interface
- `components/Dashboard.tsx` — User dashboard view
- `lib/api.ts` — HTTP client for backend communication
- `stores/editor-prefs.ts` — User editor preferences (Zustand)

---

### Backend Node.js (`/backend-node`) — Express.js + TypeScript

**Purpose:** REST API server for all business logic  
**Port:** 3000 (development)  
**Tech:** Node.js 20 LTS, Express.js, TypeScript, Supabase JWT, BullMQ, Redis

```
backend-node/
├── src/
│   ├── index.ts            ← Application entry point
│   ├── middleware/         ← Express middleware
│   │   ├── auth.ts         ← JWT verification
│   │   ├── rbac.ts         ← Role-based access control
│   │   └── errorHandler.ts ← Global error handling
│   ├── routes/             ← Route handlers (organized by feature)
│   │   ├── auth.ts         ← Authentication endpoints
│   │   ├── problems.ts     ← Problem CRUD endpoints
│   │   ├── submissions.ts  ← Code submission endpoints
│   │   ├── users.ts        ← User profile endpoints
│   │   ├── leaderboard.ts  ← Leaderboard endpoints
│   │   ├── tutor.ts        ← AI tutor endpoints
│   │   └── admin.ts        ← Admin-only endpoints
│   ├── lib/                ← Business logic & utilities
│   │   ├── supabase.ts     ← Supabase client
│   │   ├── executor.ts     ← Code execution orchestration
│   │   ├── validators.ts   ← Zod validation schemas
│   │   ├── logger.ts       ← Winston logging
│   │   └── redis.ts        ← Redis client & cache functions
│   └── types/              ← TypeScript types
│       └── index.ts        ← Central type definitions
├── package.json            ← Dependencies
├── tsconfig.json           ← TypeScript config
└── .env.example            ← Environment variables template
```

**Key Backend Files:**
- `src/index.ts` — Server initialization & route mounting
- `src/routes/problems.ts` — Problem endpoints (GET /api/problems, POST /api/problems/:id/submit)
- `src/routes/submissions.ts` — Submission tracking and results
- `src/middleware/auth.ts` — Supabase JWT verification
- `src/lib/executor.ts` — Communication with Judge0/Flask
- `src/lib/validators.ts` — Input validation (Zod schemas)

**API Endpoints:**
```
POST   /api/auth/login              — User login
POST   /api/auth/signup             — User registration
GET    /api/problems                — List all problems
GET    /api/problems/:id            — Get problem details
POST   /api/problems/:id/submit     — Submit code solution
GET    /api/submissions/:id         — Get submission result
GET    /api/leaderboard             — Get user rankings
POST   /api/tutor/message           — Ask AI tutor
GET    /api/user/profile            — Get user profile
PUT    /api/user/profile            — Update user profile
GET    /api/admin/stats             — Admin dashboard stats
```

---

### Judge0 (`/judge0`) — Rails Code Execution Engine

**Purpose:** Isolated code execution, test evaluation, AI tutor orchestration  
**Tech:** Rails 7, Ruby 3.x, Docker SDK, PostgreSQL  
**Note:** This is an external open-source project included in the workspace

```
judge0/
├── Dockerfile              ← Docker image definition
├── docker-compose.yml      ← Production Docker setup
├── docker-compose.dev.yml  ← Development Docker setup
├── app/
│   ├── controllers/        ← Rails controllers
│   ├── models/             ← Database models
│   ├── services/           ← Business logic (execution, evaluation)
│   └── jobs/               ← Background jobs (BullMQ integration)
├── db/
│   ├── schema.rb           ← Database schema
│   └── migrate/            ← Database migrations
├── config/
│   ├── routes.rb           ← Judge0 API routes
│   ├── database.yml        ← DB configuration
│   └── puma.rb             ← Server configuration
└── README.md               ← Judge0 documentation
```

**Judge0 Responsibilities:**
- Docker container lifecycle management
- Code execution in isolated sandboxes
- Test case evaluation logic
- Performance metrics calculation

---

### Supabase (`/supabase`) — Database & Auth

**Purpose:** Cloud database, authentication, real-time subscriptions  
**Tech:** PostgreSQL, Supabase Auth, Row-Level Security (RLS)

```
supabase/
├── config.toml             ← Supabase local dev config
├── seed.sql                ← Initial database seed data
└── migrations/
    ├── 20260112000000_initial_schema.sql  ← Main schema
    └── ...                 ← Additional migrations
```

**Key Database Tables:**
- `auth.users` — Managed by Supabase Auth
- `profiles` — User metadata (username, bio, skill level)
- `topics` — Problem categories
- `coding_languages` — Supported languages & configs
- `problems` — Coding problems
- `submissions` — Code submission history
- `submission_results` — Execution results & test case outputs
- `leaderboard` — User rankings & stats

---

## Tech Stack

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Server-side rendering, file-based routing |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Components | Radix UI + Custom | Accessible, unstyled components |
| Code Editor | Monaco Editor | Syntax highlighting, language support |
| State (Client) | Zustand | Global client state (editor prefs, theme) |
| State (Server) | TanStack Query v5 | Caching, background refetch, optimistic updates |
| HTTP Client | Axios | API requests with interceptors |
| Forms | React Hook Form + Zod | Form validation & submission |
| Charts | Recharts | Line, bar, radar charts, heatmaps |
| Animations | Framer Motion | Smooth page transitions, micro-interactions |
| Notifications | React Hot Toast | Toast notifications (success/error/warning) |
| Icons | Lucide React | SVG icon library |
| 3D Graphics | Three.js + React Three Fiber | Hero section animations |
| Markdown | react-markdown + remark-gfm | Render problem descriptions |

### Backend (Node.js)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 20 LTS | JavaScript execution |
| Framework | Express.js | HTTP server & routing |
| Language | TypeScript | Type safety |
| Auth | Supabase JWT | Authentication & authorization |
| Validation | Zod | Runtime input validation |
| Job Queue | BullMQ | Async code execution jobs |
| Cache | Redis | Leaderboard, question list caching |
| Rate Limiting | express-rate-limit | API rate limits |
| Logging | Winston | Structured JSON logging |
| CORS | cors | Cross-origin requests |
| Env | dotenv | Environment variable loading |

### Code Execution Engine
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Orchestration | Judge0 (Rails) | Job management & execution |
| Sandbox | Docker | Isolated code execution |
| Supported Languages | GCC, G++, Java, Python, Node, Go | Multi-language support |
| Limits | CPU: 0.5 cores, Memory: 256MB, Timeout: 5s | Resource constraints |

### Database & Infrastructure
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Primary DB | Supabase PostgreSQL | Relational data |
| Authentication | Supabase Auth | Email/OAuth sign-in |
| Real-time | Supabase Subscriptions | Live updates |
| File Storage | Supabase Storage | Avatars, problem assets |
| Cache | Redis | Performance optimization |
| Containerization | Docker Compose | Local dev environment |

---

## Environment Setup

### Prerequisites
- **Node.js:** 20 LTS ([download](https://nodejs.org/))
- **npm/yarn:** Latest version
- **Docker & Docker Compose:** For Judge0 and Redis
- **Git:** For version control
- **Supabase Account:** For backend auth & database
- **OpenAI API Key:** For AI tutor feature (optional for dev)

### 1. Clone the Repository

```bash
cd /Users/apple/Download/GitHub
git clone <repository-url>
cd CodeVerse1
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend Node.js
```bash
cd ../backend-node
npm install
```

### 3. Environment Variables

#### Frontend (`.env.local`)
Create `/frontend/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id

# Other
NEXT_PUBLIC_APP_NAME=CodeVerse
```

#### Backend Node.js (`.env`)
Create `/backend-node/.env`:

```env
# Node
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis
REDIS_URL=redis://localhost:6379

# Judge0 / Code Execution
JUDGE0_URL=http://localhost:2358

# OpenAI (for AI tutor)
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o

# Rate Limiting
RATE_LIMIT_EXECUTION=10/1m
RATE_LIMIT_TUTOR=20/1m
RATE_LIMIT_AUTH=5/1m

# CORS
CORS_ORIGIN=http://localhost:4000

# Security
JWT_SECRET=your-jwt-secret-for-local-dev
```

#### Supabase Configuration
Update `/supabase/config.toml` with your local Supabase setup, or use Supabase Cloud.

---

## Running Services

### Development Environment (All Services)

#### Option A: Docker Compose (Recommended)
```bash
# From project root
docker-compose up -d

# Includes:
# - Supabase (PostgreSQL, Auth, Storage)
# - Redis
# - Judge0 API

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Option B: Manual Services
Run each service in separate terminals:

### 1. Start Supabase (Local)
```bash
cd supabase
supabase start
# Creates local PostgreSQL, Auth, Storage on ports 54321, 54322, etc.
```

### 2. Start Redis
```bash
docker run -d -p 6379:6379 redis:latest
# Or use Homebrew: brew install redis && redis-server
```

### 3. Start Judge0
```bash
cd judge0
docker-compose -f docker-compose.dev.yml up -d

# Verify:
curl http://localhost:2358/about
```

### 4. Start Backend Node.js
```bash
cd backend-node
npm run dev
# Runs on http://localhost:3000
# Uses ts-node via tsx for live reloading
```

### 5. Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:4000
# Next.js dev server with hot reload
```

### Verification Checklist
```
✅ Frontend:    http://localhost:4000
✅ Backend API: http://localhost:3000/api/health
✅ Judge0:      http://localhost:2358/about
✅ Redis:       redis-cli ping → PONG
✅ Supabase:    http://localhost:54321 (Studio)
```

---

## Architecture & Communication

### Service Diagram
```
┌─────────────────────┐
│   Frontend (Next.js)│ http://localhost:4000
│  TanStack Query     │
│  Zustand            │
└──────────┬──────────┘
           │ HTTP/JSON
           │ WebSocket (Socket.io)
           ▼
┌──────────────────────────────┐
│  Backend Node.js (Express)   │ http://localhost:3000
│  - Auth (JWT verification)   │
│  - Problem CRUD              │
│  - Submission handling       │
│  - Leaderboard cache         │
│  - AI Tutor orchestration    │
└──────┬───────────────────────┘
       │ HTTP
       │ (Internal API)
       ▼
┌──────────────────────────────┐
│  Judge0 (Rails Executor)     │ http://localhost:2358
│  - Docker container mgmt     │
│  - Code execution            │
│  - Test evaluation           │
└──────────────────────────────┘

┌──────────────────────────────┐
│  Supabase                    │ http://localhost:54321
│  - PostgreSQL (data)         │
│  - Auth (users)              │
│  - Storage (avatars, assets) │
└──────────────────────────────┘

┌──────────────────────────────┐
│  Redis                       │ localhost:6379
│  - Leaderboard cache         │
│  - Session cache             │
│  - BullMQ job queue          │
└──────────────────────────────┘
```

### Data Flow: Code Submission
```
1. User writes code in Monaco Editor (frontend)
   ↓
2. User clicks "Submit" → Frontend sends POST /api/problems/:id/submit
   ↓
3. Backend Node.js receives submission
   - Validates code (Zod)
   - Creates submission record in Supabase
   - Enqueues BullMQ job (with code, language, test cases)
   ↓
4. BullMQ worker (in Node.js) picks up job
   - Calls Judge0 API to execute code
   - Passes test cases & expected outputs
   ↓
5. Judge0 (Rails) receives execution request
   - Creates Docker container for specified language
   - Runs code with stdin/stdout capture
   - Evaluates against test cases
   - Stores results in Supabase submission_results table
   ↓
6. Node.js sends result back to frontend via WebSocket (Socket.io)
   ↓
7. Frontend displays execution result & test case outputs
```

### Data Flow: AI Tutor Query
```
1. User types question in tutor chat (frontend)
   ↓
2. Frontend sends POST /api/tutor/message
   ↓
3. Backend Node.js receives query
   - Gets problem context from Supabase
   - Gets user's submission details
   - Constructs OpenAI prompt with context
   ↓
4. Calls OpenAI API (gpt-4o) with streaming enabled
   ↓
5. Streams response back to frontend via Socket.io
   ↓
6. Frontend displays streaming tutor response with typing indicator
```

---

## Development Workflow

### Creating a New Feature

#### 1. Create Feature Branch
```bash
git checkout -b feature/my-feature
git pull origin main
```

#### 2. Frontend Development
```bash
# Add new page/route
# → Create component in /app/your-route/page.tsx

# Add reusable component
# → Create in /components/YourComponent.tsx

# Add API integration
# → Add fetch logic in lib/api.ts
# → Integrate with TanStack Query hook

# Test locally
npm run dev
# Navigate to http://localhost:4000/your-route
```

#### 3. Backend Development
```bash
# Add new endpoint
# → Create/modify route file in src/routes/

# Add validation
# → Add Zod schema in src/lib/validators.ts
# → Use in route handler

# Add business logic
# → Create function in src/lib/
# → Import and use in route handler

# Database changes
# → Create Supabase migration
# → Run migration: supabase migration up

# Test locally
npm run dev
# Test with: curl http://localhost:3000/api/your-endpoint
# Or use Postman/Insomnia
```

#### 4. Type Safety
```bash
# Frontend type-check
cd frontend && npm run typecheck

# Backend type-check
cd backend-node && npm run typecheck
```

#### 5. Linting
```bash
# Frontend
cd frontend && npm run lint

# Backend (if configured)
cd backend-node && npm run lint
```

#### 6. Push & Create PR
```bash
git add .
git commit -m "feat: description of changes"
git push origin feature/my-feature
# Create Pull Request on GitHub
```

#### 7. Code Review & Merge
- Request review from team members
- Address feedback
- Merge to `main` branch
- Delete feature branch

---

## Key Files & Responsibilities

### Frontend

| File | Responsibility |
|------|-----------------|
| `app/layout.tsx` | Root layout, global providers (Supabase, Query, Theme) |
| `app/page.tsx` | Landing/home page |
| `app/problems/page.tsx` | Problem list with filters & pagination |
| `app/problems/[id]/page.tsx` | Individual problem page |
| `components/problems/Editor.tsx` | Code editor with Monaco |
| `components/Dashboard.tsx` | User dashboard with stats |
| `components/Navbar.tsx` | Top navigation & user menu |
| `lib/api.ts` | Axios instance with default headers & interceptors |
| `lib/auth.ts` | Supabase Auth helper functions (login, logout, signup) |
| `lib/supabaseClient.ts` | Supabase client initialization |
| `stores/editor-prefs.ts` | Zustand store for editor theme, font size, language |
| `types/index.ts` | TypeScript interfaces (Problem, User, Submission) |
| `components/providers/` | Query client provider, Supabase provider, Theme provider |

### Backend Node.js

| File | Responsibility |
|------|-----------------|
| `src/index.ts` | Server initialization, middleware setup, route mounting |
| `src/middleware/auth.ts` | JWT verification from Supabase Auth |
| `src/middleware/rbac.ts` | Role-based access control (check user role) |
| `src/routes/problems.ts` | Problem endpoints (list, get, create, update, delete) |
| `src/routes/submissions.ts` | Submission CRUD & result tracking |
| `src/routes/tutor.ts` | AI tutor endpoints |
| `src/routes/leaderboard.ts` | Leaderboard & ranking endpoints |
| `src/lib/supabase.ts` | Supabase client with service role |
| `src/lib/executor.ts` | Judge0 communication & job orchestration |
| `src/lib/validators.ts` | Zod schemas for request validation |
| `src/lib/redis.ts` | Redis client & cache functions |
| `src/types/index.ts` | TypeScript interfaces for database tables |

### Supabase

| File | Responsibility |
|------|-----------------|
| `migrations/20260112000000_initial_schema.sql` | Initial database schema & RLS policies |
| `seed.sql` | Initial seed data (languages, topics, sample problems) |
| `config.toml` | Local Supabase configuration |

---

## Common Development Tasks

### Task: Add a New Problem Type

**Files to modify:**
1. **Database:** Create Supabase migration
2. **Backend:** Add validation & endpoint
3. **Frontend:** Create form & UI

**Steps:**

```bash
# 1. Database migration
cd supabase
supabase migration new add_problem_type
# Edit the new migration file

# 2. Update backend validation
cd ../backend-node
# Edit src/lib/validators.ts → add new schema

# 3. Update backend route
# Edit src/routes/problems.ts → add handler for new type

# 4. Update frontend
cd ../frontend
# Create/update form component in app/problems/new/
# Update types/index.ts
```

### Task: Fix a Bug in Code Submission Flow

**Trace the path:**
1. Frontend submission form → `components/problems/Editor.tsx`
2. API call → `lib/api.ts` → `POST /api/problems/:id/submit`
3. Backend endpoint → `src/routes/submissions.ts`
4. Judge0 executor → `src/lib/executor.ts`
5. Database storage → Supabase `submissions` table
6. WebSocket response → Socket.io event

**Debug approach:**
```bash
# 1. Check frontend console (browser DevTools)
# 2. Check backend logs: npm run dev (look for errors)
# 3. Check Redis job queue: redis-cli
# 4. Check Judge0 logs: docker logs <judge0-container>
# 5. Check database: Supabase Studio
```

### Task: Add a New Analytics Chart

**Files:**
1. `components/Dashboard.tsx` — Add chart component
2. `lib/api.ts` — Add API call for data
3. `stores/editor-prefs.ts` — Store chart preference if needed
4. `types/index.ts` — Define analytics data type

**Example:**
```typescript
// 1. Add to lib/api.ts
export const fetchAnalyticsData = () => 
  api.get('/api/user/analytics');

// 2. Use in Dashboard.tsx with TanStack Query
const { data } = useQuery({
  queryKey: ['analytics'],
  queryFn: () => fetchAnalyticsData(),
});

// 3. Render with Recharts
<BarChart data={data}>
  <Bar dataKey="submissions" fill="#8b5cf6" />
</BarChart>
```

### Task: Deploy to Production

**Checklist:**
- [ ] All tests passing
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] No linting errors: `npm run lint`
- [ ] Environment variables set in production
- [ ] Database migrations run
- [ ] Built successfully: `npm run build`
- [ ] Started successfully: `npm start`

**Commands:**
```bash
# Build
cd frontend && npm run build
cd ../backend-node && npm run build

# Deploy (depends on hosting provider)
# For Vercel (frontend):
vercel deploy --prod

# For Node.js (backend):
# Push to your hosting platform (Railway, Render, AWS, etc.)
```

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms:** `Error: Network error` in browser console

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:3000/api/health

# 2. Check CORS configuration
# In backend-node/.env, verify CORS_ORIGIN=http://localhost:4000

# 3. Check frontend .env
# Verify NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# 4. Restart backend
# Kill process and: npm run dev
```

### Issue: Code submission not executing

**Symptoms:** Submission stuck in "pending" state

**Solutions:**
```bash
# 1. Check Judge0 is running
curl http://localhost:2358/about

# 2. Check Redis is running
redis-cli ping

# 3. Check backend logs for BullMQ errors
# Look for error messages in npm run dev output

# 4. Check Judge0 logs
docker logs <judge0-container-id>

# 5. Restart all services
docker-compose down && docker-compose up -d
```

### Issue: Database queries failing

**Symptoms:** Backend errors mentioning Supabase

**Solutions:**
```bash
# 1. Check Supabase connection
curl http://localhost:54321 # if using local

# 2. Verify .env variables
cat backend-node/.env | grep SUPABASE

# 3. Check Supabase Studio
# Go to http://localhost:54321 and verify tables exist

# 4. Run migrations
supabase migration up

# 5. Check JWT token
# Backend should verify JWT from auth header
```

### Issue: Monaco Editor not loading in frontend

**Symptoms:** Editor shows blank area or errors in console

**Solutions:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Check Monaco Editor files are downloaded
# Should be in node_modules/@monaco-editor/

# 4. Restart frontend
# Kill npm run dev and restart
```

### Issue: Rate limiting errors

**Symptoms:** `429 Too Many Requests` errors

**Solutions:**
```bash
# Check backend-node/.env rate limit settings
RATE_LIMIT_EXECUTION=10/1m
RATE_LIMIT_TUTOR=20/1m

# Adjust if needed (for development, can increase)

# For testing, temporarily disable:
# Comment out rate limiting middleware in src/middleware/
```

### Issue: Slow performance

**Analysis:**
```bash
# 1. Check frontend bundle size
cd frontend && npm run build
# Look at .next/ folder size

# 2. Check backend response times
# Add logging in src/lib/logger.ts

# 3. Check database queries
# Use Supabase Studio → Logs tab

# 4. Check Redis cache hit rate
redis-cli info stats
```

---

## Development Best Practices

### Code Quality
- ✅ Always use TypeScript strict mode
- ✅ Validate all inputs with Zod
- ✅ Use Zustand for client state, TanStack Query for server state
- ✅ Keep components small and focused
- ✅ Use consistent naming: camelCase for variables, PascalCase for components

### Frontend
- ✅ Minimize re-renders: use `useCallback`, `useMemo`
- ✅ Use TanStack Query for API data (never useState for async data)
- ✅ Keep styling with Tailwind only (no inline styles)
- ✅ Extract components when JSX exceeds 100 lines
- ✅ Use `next/image` for images, `next/link` for links

### Backend
- ✅ Always use middleware for auth/RBAC
- ✅ Validate requests with Zod before processing
- ✅ Use structured logging (Winston JSON format)
- ✅ Implement proper error handling (try-catch + status codes)
- ✅ Cache frequently accessed data (Redis)
- ✅ Add rate limiting to expensive endpoints

### Database
- ✅ Enable Row-Level Security (RLS) on all tables
- ✅ Create migrations for all schema changes
- ✅ Seed database with initial data
- ✅ Use foreign keys for referential integrity
- ✅ Index frequently queried columns

### Git Workflow
- ✅ Create feature branch from `main`
- ✅ Keep commits atomic and descriptive
- ✅ Rebase before pushing: `git rebase origin/main`
- ✅ Create Pull Request with description
- ✅ Request review before merging
- ✅ Delete branch after merge

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com
- **Supabase Docs:** https://supabase.com/docs
- **TanStack Query Docs:** https://tanstack.com/query
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Docker Docs:** https://docs.docker.com
- **Redis Docs:** https://redis.io/docs

---

## Quick Reference

### Commands Cheatsheet

```bash
# Frontend
cd frontend && npm run dev           # Start dev server
cd frontend && npm run build         # Build for prod
cd frontend && npm run typecheck     # Type check only
cd frontend && npm run lint          # Lint code

# Backend
cd backend-node && npm run dev       # Start dev server with tsx
cd backend-node && npm run build     # Compile TypeScript
cd backend-node && npm start         # Run compiled JS
cd backend-node && npm run typecheck # Type check only

# Docker
docker-compose up -d                 # Start all services
docker-compose down                  # Stop all services
docker-compose logs -f               # View logs (all)
docker-compose ps                    # View running containers

# Supabase (local)
supabase start                        # Start local Supabase
supabase migration up                 # Run migrations
supabase stop                         # Stop local Supabase
supabase db reset                     # Reset & reseed database

# Redis
redis-cli ping                        # Check Redis connection
redis-cli KEYS '*'                    # View all keys
redis-cli FLUSHALL                    # Clear all keys

# Git
git checkout -b feature/my-feature    # Create feature branch
git push origin feature/my-feature    # Push branch
git pull origin main                  # Sync with main
git rebase origin/main                # Rebase on main
```

---

**Last Updated:** April 2026  
**Maintained By:** DP  
**Questions?** Check the Roadmap.md for full platform specification or developer_guide.md for quick setup reference.
