# FieldMate on Cloudflare Workers

Use **Workers**, not Pages static upload. Connect `jawadalikhan099-design/FieldMate`, branch `main`.

- Worker name: `fieldmate`
- Root directory: `/`
- Build command: `pnpm run build:cloudflare`
- Deploy command: `pnpm run deploy`
- Node version: `22`

The generated deployment config is `dist/server/wrangler.json`. Both commands must run in the same build job. Do not upload the source ZIP as static files. No D1 database or D1 migration is needed: this version uses the existing Supabase project with authenticated per-user requests and RLS.

After deployment, configure the returned HTTPS URL in Supabase Authentication Site URL and add `<URL>/auth/confirm` to redirect URLs. Customer email confirmation requires functioning SMTP; deployment alone does not configure email delivery. Complete an owner signup, confirmed email login, admin bootstrap, and a separate customer's isolated-record check before sharing with paying customers.

This repository's independent account database is separate from the existing chatgpt.site records. No original records have been migrated. Current original-site changes such as YTD are not automatically copied here.

Validation: authentication/origin/ownership/subscription tests and the Cloudflare production build pass locally. The local Wrangler runtime could not start in the restricted execution host (`uv_interface_addresses`); a real Cloudflare deployment and login test are still required.
