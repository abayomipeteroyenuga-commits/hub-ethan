ETHAN HUB v4.3 — MULTI-MODE SUPABASE CALLBACK
Based on v4.2.

The physical /auth/callback now supports:
- PKCE ?code=... confirmation
- implicit #access_token + refresh_token confirmation
- Supabase detectSessionInUrl session recovery
- Supabase error fragments/query parameters
- persisted browser session before redirecting to Hub

Use a NEW confirmation email. Do not reuse an already-clicked or previously shared verification token.
Upload extracted contents to the existing fresh GitHub repository and allow Vercel to redeploy.
