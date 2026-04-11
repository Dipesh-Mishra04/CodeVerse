# Professional Project Structure

```
leetcode-clone/
  frontend/                 # Next.js (Node.js) app
    app/                    # Route-based pages (auth, dashboard, landing)
    components/             # Shared UI sections for landing pages
    features/
      dashboard/
        components/         # Dashboard-specific UI (profile, mini-leetcode, ai tutor)
        types.ts            # Dashboard domain types
    lib/                    # Client SDK wrappers (auth, supabase, profile)
    supabase/
      migrations/           # SQL migrations for profile and future tables
  backend/                  # Flask APIs for AI tutor and platform services
    app/
      routes/               # Health and tutor endpoints
    requirements.txt
    run.py
```

## Why this structure
- Keeps frontend and backend clearly separated.
- Uses feature-based frontend modules for scalability.
- Keeps shared infrastructure code under `lib/`.
- Supports adding more backend services without coupling to UI.
