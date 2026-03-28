# TODO: Fix MIDDLEWARE_INVOCATION_FAILED on Vercel

## Steps:
- [x] Create TODO.md with plan breakdown
- [x] Fix invalid regex in middleware.ts (updated to include webp and fix escape)
- [x] Create/update .env.example with Supabase vars template
- [x] Commit and push changes
- [ ] Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel Environment Variables (this likely causes middleware fail if missing, leading to __dirname-like internal errors)
- [x] Test locally with npm run build && npm run start (✓ Compiled successfully, Middleware proxy recognized, no errors)
