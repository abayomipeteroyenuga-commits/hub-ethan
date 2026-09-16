ETHAN HUB v4.2 — DIRECT SUPABASE CALLBACK

Based directly on the uploaded v4.1 deployment.

Fix:
- /auth/callback now processes the Supabase PKCE `code` itself.
- Calls exchangeCodeForSession(code).
- Requires a real session before redirecting.
- Shows “Email verified successfully” before opening Ethan Hub.
- Session is persisted by Supabase in the browser.
- No forwarding of an unprocessed code to the homepage.
- No Super Admin approval gate.

Upload the extracted contents to the SAME fresh GitHub repository and let Vercel redeploy.
Do not change the domain or Supabase URL Configuration.
