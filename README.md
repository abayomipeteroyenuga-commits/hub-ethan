ETHAN HUB v4.1 — PHYSICAL CALLBACK ROUTE

This build fixes Vercel 404 by including a real:
auth/callback.html

With Vercel cleanUrls enabled, it is available publicly as:
/auth/callback

The callback preserves the Supabase query/hash confirmation payload and hands it to the main app.
The main app then processes the code and signs the user in.

Upload the EXTRACTED contents to the repository root.
Expected root:
index.html
vercel.json
auth/callback.html
supabase/...
README.md
