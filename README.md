# ETHAN HUB v4.0 — FRESH REPOSITORY BUILD

Use this package for a completely NEW GitHub repository and NEW Vercel project.

Repository root:
- index.html
- vercel.json
- README.md

Do not copy any files from the old Ethan Hub repository.

Authentication flow:
Create Ethan ID → Supabase verification email → /auth/callback?code=... →
exchange code for authenticated session → sync verified profile → enter Ethan Hub →
clean URL to https://hub.ethandigitalacademy.org/

Important:
1. Deploy the new Vercel project first using its temporary *.vercel.app address.
2. After confirming it loads, move hub.ethandigitalacademy.org from the OLD Vercel project to the NEW project.
3. Supabase Authentication URL Configuration should use:
   Site URL: https://hub.ethandigitalacademy.org
   Redirect URL: https://hub.ethandigitalacademy.org/auth/callback
4. The v3.6 Supabase SQL/profile permissions remain required; no additional approval system is used.
