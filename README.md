# FieldMate — independent sales workspace

FieldMate is a Next.js application with email/password accounts and a Supabase database. The production target is **Cloudflare Workers** (not a static Cloudflare Pages upload). The existing Netlify and Render configurations are alternative deployment paths; do not switch hosts or databases without a deliberate migration.

## Cloudflare deployment

The checked-in Worker configuration is `wrangler.jsonc`. The production build generates `dist/server/wrangler.json`. Use Node.js 22 and pnpm 11.25.0.

### Option A: GitHub Actions (manual)

The repository contains **Actions → Deploy FieldMate to Cloudflare Workers → Run workflow**. This is manual-only: pushing code does not publish the website.

Before the first run, the repository administrator must add two GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN`: a Cloudflare API token authorized to edit Workers scripts for the intended account.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID for that Worker.

The workflow installs locked dependencies, runs `pnpm check`, builds the Cloudflare Worker, checks that both secrets exist, then deploys using the generated config and `--keep-vars`. **Do not put either credential in the repository or in chat.** If the credentials are absent, deployment fails safely without publishing.

### Option B: Cloudflare dashboard

Connect GitHub repository `jawadalikhan099-design/FieldMate`, branch `main`, as a **Worker**.

- Worker name: `fieldmate`
- Root directory: `/`
- Build command: `pnpm run build:cloudflare`
- Deploy command: `pnpm run deploy`
- Node version: `22`

Both commands must run in the same job because deployment uses the generated `dist/server/wrangler.json`. Do not upload a ZIP as a static site.

### After deployment (required before customer access)

1. Record the actual HTTPS Worker URL.
2. In the **same Supabase project configured in `wrangler.jsonc`**, set Authentication Site URL to that HTTPS URL and allow the exact `<URL>/auth/confirm` redirect. There are multiple FieldMate-related Supabase projects; do not silently switch between them.
3. Configure working SMTP for customer confirmation email.
4. Test `/api/health`, owner registration and confirmed sign-in, admin bootstrap, and a second user who cannot access the owner's records.
5. Verify subscription/access controls before inviting paying customers.

Supabase holds the account data; no Cloudflare D1 database is needed. Existing records from the older chatgpt.site FieldMate were **not migrated**. The deployment workflow does not migrate, reset, or delete any Supabase tables.

See [CLOUDFLARE.md](CLOUDFLARE.md) for additional details.
