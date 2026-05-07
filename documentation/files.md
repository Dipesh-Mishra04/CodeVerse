# CodeVerse File Structure & Descriptions

## Root Files

### DEVELOPMENT.md
**Complete development guide covering:**
- Project architecture and tech stack
- Directory structure with file descriptions
- Setup instructions and environment configuration
- How to run all services (frontend, backend, Judge0, Supabase)
- Data flow diagrams
- Development workflow and best practices
- Troubleshooting guide

👉 **Start here if you're setting up development environment**

### developer_guide.md
Quick reference guide with basic setup and run commands for all services.

### Roadmap.md
Full platform specification including:
- Product vision and features
- Tech stack requirements
- Database schema (DDL)
- API endpoints
- Security requirements

---

## Frontend (`/frontend`)

### App Structure (`app/`)
The Next.js App Router pages - each folder is a route

- **layout.tsx** — Root layout wrapper with global providers (Supabase, Query Client, Theme)
- **page.tsx** — Home/landing page
- **globals.css** — Global Tailwind styles and CSS variables
- **auth/** — Authentication pages (login, signup, OTP verification)
- **dashboard/** — Main user dashboard with stats and quick actions
- **problems/** — Problem listing, filtering, and individual problem pages
- **editor/** — Code editor interface (IDE for writing solutions)
- **analytics/** — User performance graphs and statistics
- **leaderboard/** — Global user rankings and competition
- **tutor/** — AI virtual tutor chat interface
- **profile/** — User profile page with settings
- **settings/** — User preferences and configuration
- **admin/** — Admin panel for moderators/administrators

### Components (`components/`)
Reusable React components

- **dashboard/** — Dashboard-specific components (stats cards, charts)
- **problems/** — Problem-related components (problem card, filter, pagination)
- **layout/** — Layout components (header, sidebar, footer)
- **ui/** — Primitive UI components (buttons, modals, forms, dialogs)
- **theme/** — Theme provider and theme-related components
- **providers/** — Global providers (Supabase, Query Client, Auth Context)
- **Navbar.tsx** — Top navigation bar with logo and user menu
- **Footer.tsx** — Footer with links and copyright
- **Hero3D.tsx** — 3D hero section using Three.js (landing page)
- **HeroSection.tsx** — Text-based hero section
- **FeaturesSection.tsx** — Features overview section
- **HowItWorksSection.tsx** — How the platform works section
- **ContactSection.tsx** — Contact form section

### Library (`lib/`)
Utility functions and helper modules

- **api.ts** — Axios HTTP client with base URL, headers, and interceptors
- **auth.ts** — Authentication helpers (login, logout, signup, password reset)
- **supabaseClient.ts** — Supabase client initialization and configuration
- **utils.ts** — General utility functions (formatters, validators, helpers)
- **mock-data.ts** — Demo/test data for development and showcases

### State Management (`stores/`)
Zustand stores for client-side state

- **editor-prefs.ts** — Editor preferences (theme, font size, language, indentation)
- **theme-store.ts** — Application theme state (dark/light mode)

### Types (`types/`)
TypeScript type definitions

- **index.ts** — All shared TypeScript interfaces and types (Problem, User, Submission, etc.)

### Configuration Files

- **package.json** — Dependencies and scripts (dev, build, lint)
- **tsconfig.json** — TypeScript compiler options (strict mode enabled)
- **next.config.ts** — Next.js configuration
- **tailwind.config.js** — Tailwind CSS customization (colors, fonts, spacing)
- **postcss.config.mjs** — PostCSS configuration (Tailwind processing)
- **eslint.config.mjs** — ESLint rules for code quality
- **proxy.ts** — API proxy configuration (for development)
- **next-env.d.ts** — Auto-generated Next.js types

### Assets (`public/`)
Static files (images, fonts, icons) - served directly by Next.js

---

## Backend Node.js (`/backend-node`)

### Entry Point (`src/index.ts`)
- Server initialization
- Express app setup
- Middleware registration (CORS, helmet, rate limiting, auth)
- Route mounting
- Error handler setup
- Server listen on port 3000

### Middleware (`src/middleware/`)
Express middleware functions

- **auth.ts** — JWT verification from Supabase Auth header
- **rbac.ts** — Role-based access control (checks user role: user/moderator/admin)
- **errorHandler.ts** — Global error handling and response formatting
- **rateLimiter.ts** — Rate limiting for different endpoint types
- **logger.ts** — Request/response logging with Winston

### Routes (`src/routes/`)
Feature-specific endpoint handlers (REST API)

- **auth.ts** — Authentication endpoints
  - `POST /api/auth/login` — User login
  - `POST /api/auth/signup` — User registration
  - `POST /api/auth/logout` — Logout
  - `POST /api/auth/refresh` — Refresh JWT token

- **problems.ts** — Problem management endpoints
  - `GET /api/problems` — List all problems (with filters)
  - `GET /api/problems/:id` — Get problem details
  - `POST /api/problems` — Create new problem (admin only)
  - `PUT /api/problems/:id` — Update problem (admin only)
  - `DELETE /api/problems/:id` — Delete problem (admin only)

- **submissions.ts** — Code submission endpoints
  - `POST /api/problems/:id/submit` — Submit code solution
  - `GET /api/submissions/:id` — Get submission details and results
  - `GET /api/user/submissions` — Get user's submission history

- **users.ts** — User profile endpoints
  - `GET /api/user/profile` — Get current user profile
  - `PUT /api/user/profile` — Update user profile
  - `GET /api/user/stats` — Get user statistics
  - `GET /api/user/streak` — Get user's daily streak

- **leaderboard.ts** — Ranking endpoints
  - `GET /api/leaderboard` — Global leaderboard with pagination
  - `GET /api/leaderboard/:id` — User's leaderboard position

- **tutor.ts** — AI tutor endpoints
  - `POST /api/tutor/message` — Send message to AI tutor
  - `GET /api/tutor/history` — Get tutor chat history

- **admin.ts** — Admin-only endpoints
  - `GET /api/admin/stats` — Platform statistics
  - `GET /api/admin/users` — User management

### Library (`src/lib/`)
Business logic and helper functions

- **supabase.ts** — Supabase client initialization (with service role key)
- **executor.ts** — Code execution orchestration
  - Communicates with Judge0 API
  - Manages job submission and result retrieval
  - Handles test case evaluation
  - Logs execution metrics

- **validators.ts** — Zod validation schemas
  - Request body validation schemas
  - Query parameter schemas
  - All reusable validation logic

- **logger.ts** — Winston logger setup
  - Structured JSON logging
  - Request ID tracing
  - Different log levels (info, warn, error)

- **redis.ts** — Redis client and caching functions
  - Cache get/set operations
  - Leaderboard caching (TTL 5 minutes)
  - Problem list caching (TTL 10 minutes)

### Types (`src/types/`)
TypeScript type definitions

- **index.ts** — Database table types and API response types

### Configuration Files

- **package.json** — Dependencies and scripts (dev, build, typecheck)
- **tsconfig.json** — TypeScript compiler options (strict mode)
- **.env.example** — Template for environment variables (copy to .env for development)

---

## Judge0 (`/judge0`)

Rails-based code execution engine (external open-source project included)

### Configuration Files

- **Dockerfile** — Docker image definition for Judge0 service
- **docker-compose.yml** — Production Docker setup (includes database, Redis)
- **docker-compose.dev.yml** — Development Docker setup
- **docker-entrypoint.sh** — Container startup script

- **config.ru** — Rack configuration (Rails WSGI server)
- **Rakefile** — Rake task definitions
- **judge0.conf** — Judge0-specific configuration (languages, resource limits)

### Application Code (`app/`)

- **controllers/** — Rails controllers handling requests
- **models/** — Database models and logic
- **services/** — Business logic (execution, evaluation, AI integration)
- **jobs/** — Background jobs (BullMQ integration)
- **views/** — Response templates

### Database (`db/`)

- **schema.rb** — Current database schema
- **seeds.rb** — Initial database seed data
- **migrate/** — Database migrations
- **languages/** — Supported programming language configurations

### Configuration (`config/`)

- **routes.rb** — API route definitions
- **database.yml** — Database connection settings
- **puma.rb** — Puma web server configuration
- **environments/** — Environment-specific configs (development, production)

### Documentation

- **README.md** — Judge0 setup and usage documentation
- **CHANGELOG.md** — Version history
- **SECURITY.md** — Security considerations
- **CODE_OF_CONDUCT.md** — Community guidelines

---

## Supabase (`/supabase`)

Database and authentication configuration

### Configuration

- **config.toml** — Supabase local development configuration
  - PostgreSQL settings
  - Auth configuration
  - Storage buckets
  - Port mappings

### Database

- **seed.sql** — Initial data to populate on database creation
  - Coding languages (C, C++, Java, Python, etc.)
  - Problem topics and categories
  - Sample problems for testing
  - Admin user seeding

### Migrations (`migrations/`)

- **20260112000000_initial_schema.sql** — Main database schema
  - `profiles` table — User metadata
  - `topics` table — Problem categories
  - `coding_languages` table — Language configurations
  - `problems` table — Coding problems
  - `test_cases` table — Problem test cases
  - `submissions` table — Submission records
  - `submission_results` table — Execution results
  - Row-Level Security (RLS) policies for all tables

- **...** — Additional migration files for schema updates

---

## Documentation (`/documentation`)

- **files.md** — This file. Describes all files and directories in the project
- **api.md** — (Optional) API documentation and endpoint reference

---

## Summary by Purpose

### If you want to...

**Add a new web page**
→ Create page in `/frontend/app/your-route/page.tsx`

**Create a reusable UI component**
→ Add to `/frontend/components/ui/` or domain-specific folder

**Add a new API endpoint**
→ Create/modify file in `/backend-node/src/routes/`

**Change database schema**
→ Create migration in `/supabase/migrations/`

**Configure authentication**
→ Modify `/frontend/lib/auth.ts` and `/backend-node/middleware/auth.ts`

**Adjust code execution limits**
→ Edit `/judge0/judge0.conf` and `/judge0/config/` files

**Add new programming language support**
→ Update Judge0 configuration and seed language in Supabase

**Change styling/theme**
→ Modify `/frontend/tailwind.config.js` and `/frontend/app/globals.css`

**Fix a bug**
→ Trace through DEVELOPMENT.md's "Data Flow" diagrams to find affected files

---

**For complete information on development setup and workflow, see DEVELOPMENT.md**