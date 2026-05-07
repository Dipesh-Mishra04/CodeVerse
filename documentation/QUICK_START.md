# CodeVerse Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 20 LTS installed
- Docker & Docker Compose installed
- Supabase account (or local Supabase)
- Git installed

### One-Command Setup
```bash
# From project root
git clone <repo> && cd CodeVerse1

# Copy environment templates
cp frontend/.env.example frontend/.env.local
cp backend-node/.env.example backend-node/.env

# Edit .env files with your credentials, then:
npm install --prefix frontend
npm install --prefix backend-node

# Start all services
docker-compose up -d

# Terminal 1: Backend
npm --prefix backend-node run dev

# Terminal 2: Frontend
npm --prefix frontend run dev

# Open http://localhost:4000
```

---

## 📋 Cheat Sheet

### Most Common Commands

```bash
# Frontend
cd frontend
npm run dev          # Start dev server on :4000
npm run build        # Build for production
npm run lint         # Check code style
npm run typecheck    # Check TypeScript errors

# Backend
cd backend-node
npm run dev          # Start dev server on :3000
npm run build        # Compile TypeScript
npm run typecheck    # Check TypeScript errors
npm start            # Run compiled version

# Docker (all services)
docker-compose up -d       # Start all containers
docker-compose down        # Stop all containers
docker-compose ps          # View container status
docker-compose logs -f     # View live logs

# Database
cd supabase
supabase start             # Start local Supabase
supabase migration up      # Run migrations
supabase db reset          # Reset database
supabase stop              # Stop local Supabase

# Git (feature development)
git checkout -b feature/my-feature
git add .
git commit -m "feat: description"
git push origin feature/my-feature
# Create PR on GitHub
```

---

## 🔧 Common Tasks

### Task 1: Add a New Problem Page

**What:** Create a page to view a single problem

**How:**
```bash
# 1. Create page component
touch frontend/app/problems/[id]/page.tsx

# 2. Add content
# - Fetch problem from /api/problems/:id
# - Display problem title, description, examples
# - Show code editor component
# - Add submit button

# 3. Add to navigation
# Edit frontend/components/Navbar.tsx → add link

# 4. Test locally
npm run dev
# Navigate to http://localhost:4000/problems/123
```

### Task 2: Add a New API Endpoint

**What:** Create `GET /api/problems/:id/editorials` endpoint

**How:**
```bash
# 1. Create/update route file
# File: backend-node/src/routes/problems.ts

# 2. Add validation
# File: backend-node/src/lib/validators.ts
export const editorialParamSchema = z.object({
  id: z.string().uuid(),
});

# 3. Add endpoint handler
router.get('/problems/:id/editorials', async (req, res) => {
  // Validate
  // Query database
  // Return response
});

# 4. Test with curl
curl http://localhost:3000/api/problems/abc-123/editorials

# 5. Call from frontend
const { data } = useQuery({
  queryKey: ['editorial', problemId],
  queryFn: () => api.get(`/api/problems/${problemId}/editorials`),
});
```

### Task 3: Fix a TypeScript Error

**What:** Resolve type checking failures

**How:**
```bash
# 1. Check errors
cd frontend && npm run typecheck

# 2. Understand the error
# Read the error message - usually tells you exactly what's wrong

# 3. Fix the code
# Add missing type annotation, fix property name, etc.

# 4. Verify
npm run typecheck
```

### Task 4: Debug Code Submission Not Working

**What:** User clicks submit but nothing happens

**How:**
```bash
# 1. Check browser console (F12 → Console tab)
# Look for fetch errors, JS errors

# 2. Check network tab (F12 → Network tab)
# Click submit, see if POST /api/problems/:id/submit is sent
# Check response status and body

# 3. Check backend logs
# In terminal running "npm run dev", look for errors

# 4. Check Judge0 is running
curl http://localhost:2358/about

# 5. Check Redis is running
redis-cli ping

# 6. Restart services if needed
docker-compose restart
npm run dev
```

### Task 5: Add a New User Field

**What:** Add "company" field to user profile

**How:**
```bash
# 1. Database migration
cd supabase
supabase migration new add_company_to_profiles

# 2. Edit migration file - add column
ALTER TABLE profiles ADD COLUMN company TEXT;

# 3. Run migration
supabase migration up

# 4. Update types
# File: backend-node/src/types/index.ts
export interface Profile {
  id: string;
  username: string;
  company: string;  // Add here
}

# 5. Update frontend type
# File: frontend/types/index.ts
export interface User {
  id: string;
  username: string;
  company?: string;  // Add here
}

# 6. Update form
# File: frontend/components/profile/EditProfile.tsx
<input name="company" type="text" />

# 7. Update API call
// In lib/api.ts or route handler
const updateProfile = (data: Partial<Profile>) =>
  api.put('/api/user/profile', data);
```

### Task 6: Clear Cache and Restart

**What:** You're seeing stale data after changes

**How:**
```bash
# Frontend
cd frontend
npm cache clean --force
rm -rf .next
npm run dev

# Backend
cd backend-node
npm cache clean --force
npm run dev

# Redis cache
redis-cli FLUSHALL

# Database (if needed)
cd supabase
supabase db reset

# Full nuclear option (Docker)
docker-compose down -v  # Remove volumes
docker-compose up -d
```

---

## 🐛 Troubleshooting

### ❌ "Cannot GET /api/problems"
**Cause:** Backend not running or wrong port  
**Fix:**
```bash
# Terminal 1: Check backend is running
npm --prefix backend-node run dev

# Terminal 2: Test endpoint
curl http://localhost:3000/api/problems
```

### ❌ "NEXT_PUBLIC_API_BASE_URL is not defined"
**Cause:** .env.local missing  
**Fix:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with correct values
npm run dev
```

### ❌ "Failed to connect to Supabase"
**Cause:** Wrong credentials or Supabase not running  
**Fix:**
```bash
# Check .env has correct SUPABASE_URL and keys
cat backend-node/.env | grep SUPABASE

# Or if using local Supabase
supabase start
supabase status  # Check it's running
```

### ❌ "Port 3000 already in use"
**Cause:** Another process using the port  
**Fix:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### ❌ "Docker containers not starting"
**Cause:** Port conflicts, insufficient resources  
**Fix:**
```bash
# See what's using ports
docker ps
docker logs <container-id>

# Try restarting
docker-compose down
docker-compose up -d

# Check resources
docker stats

# Rebuild containers
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### ❌ "Module not found: 'zod'"
**Cause:** Dependencies not installed  
**Fix:**
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ "Cannot find module '@/components/...'"
**Cause:** Wrong path or tsconfig alias issue  
**Fix:**
```bash
# Check tsconfig.json has correct paths
# "@/*" should map to "./

# Check file actually exists at that path
ls -la src/components/YourComponent.tsx

# Try exact relative path
import YourComponent from '../../components/YourComponent';
```

---

## 📊 Monitoring & Debugging

### Check Service Status
```bash
# Frontend
curl http://localhost:4000

# Backend
curl http://localhost:3000/api/health

# Judge0
curl http://localhost:2358/about

# Redis
redis-cli ping

# Supabase (local)
curl http://localhost:54321
```

### View Logs
```bash
# Backend (while running)
npm run dev  # Logs appear in terminal

# Frontend (while running)
npm run dev  # Logs appear in terminal

# Docker containers
docker-compose logs -f judge0
docker-compose logs -f  # All containers

# Backend file logging
tail -f backend-node/logs/app.log
```

### Database Inspection
```bash
# Connect to local Supabase PostgreSQL
psql postgres://postgres:postgres@localhost:54322/postgres

# List tables
\dt

# View profiles table
SELECT * FROM profiles;

# View problems
SELECT * FROM problems;
```

### Redis Inspection
```bash
# Connect to Redis
redis-cli

# View all keys
KEYS *

# Get a specific key
GET leaderboard:cache

# Get key statistics
INFO

# Clear all keys
FLUSHALL
```

---

## 🏗️ Architecture Quick Reference

### Data Flow: Submission
```
User Code → Frontend Form
    ↓
POST /api/problems/:id/submit
    ↓
Backend validates input (Zod)
    ↓
Create submission record (Supabase)
    ↓
Queue BullMQ job (Redis)
    ↓
BullMQ worker picks up job
    ↓
POST to Judge0 API
    ↓
Judge0 spawns Docker container
    ↓
Code executes, test cases evaluated
    ↓
Results stored (Supabase)
    ↓
WebSocket notification to frontend
    ↓
Frontend displays results
```

### File Access Pattern

```
Frontend → lib/api.ts (HTTP Client)
Backend → src/lib/supabase.ts (Database)
          src/lib/executor.ts (Judge0)
          src/lib/redis.ts (Cache)
Judge0 → PostgreSQL (Store results)
```

---

## 💡 Pro Tips

### 1. Use VS Code REST Client
```
# Install "REST Client" extension
# Create file api.rest

@baseUrl = http://localhost:3000/api

### Get problems
GET {{baseUrl}}/problems

### Submit code
POST {{baseUrl}}/problems/abc-123/submit
Content-Type: application/json

{
  "code": "console.log('hello')",
  "language": "javascript"
}
```

### 2. Use Postman/Insomnia
- Easier UI for testing APIs
- Save requests and collections
- Test environment variables

### 3. Use Redis UI
```bash
# Install Redis UI
npm install -g @vector-im/redis-commander

# Start on port 8081
redis-commander
```

### 4. Enable Debug Logging
```bash
# Frontend
NEXT_PUBLIC_DEBUG=true npm run dev

# Backend
DEBUG=* npm run dev
```

### 5. Use React DevTools
```bash
# Install React DevTools browser extension
# See component tree and state in browser
```

### 6. Faster Development Loop
```bash
# Use tsx watch for instant restarts
npm --prefix backend-node run dev

# Use Next.js fast refresh (automatic)
npm --prefix frontend run dev
```

---

## 📚 File Navigation Quick Links

### Frontend Key Files
- Pages: `frontend/app/*/page.tsx`
- Components: `frontend/components/`
- API calls: `frontend/lib/api.ts`
- Types: `frontend/types/index.ts`
- Styling: `frontend/app/globals.css`, `frontend/tailwind.config.js`

### Backend Key Files
- Routes: `backend-node/src/routes/*.ts`
- Types: `backend-node/src/types/index.ts`
- Validation: `backend-node/src/lib/validators.ts`
- Database: `backend-node/src/lib/supabase.ts`
- Execution: `backend-node/src/lib/executor.ts`

### Database Key Files
- Schema: `supabase/migrations/*/initial_schema.sql`
- Seed: `supabase/seed.sql`
- Config: `supabase/config.toml`

---

## ❓ When to Check What

| Issue | Check | Command |
|-------|-------|---------|
| Page not loading | Browser network tab | F12 → Network |
| API returning 404 | Backend running | `curl http://localhost:3000/api/problems` |
| API returning 401 | Auth token/JWT | Check `Authorization` header |
| Data not showing | Database | `SELECT * FROM problems;` (psql) |
| Slow execution | Judge0 logs | `docker-compose logs judge0` |
| Cache stale | Redis | `redis-cli KEYS *` |
| Type errors | TypeScript check | `npm run typecheck` |
| Style issues | DevTools | F12 → Elements → Computed styles |

---

## 🎯 Next Steps

1. **Read DEVELOPMENT.md** for complete setup guide
2. **Read Roadmap.md** for feature specifications  
3. **Read documentation/files.md** for detailed file descriptions
4. **Start with a small feature** — add a UI button, style a component
5. **Make a git commit** to test your workflow
6. **Create a Pull Request** to practice code review

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Questions?** Check DEVELOPMENT.md or reach out to the team
