# FieldMate — independent deployment

Prepared 9 November 2026. This is a separate source package. It has NOT been deployed and contains no customer records, passwords, provider keys or access grants. The existing hosted Site is unchanged.

## What is included

The existing FieldMate design, logo, Overview, Area Sales, Target & Sales, Incentive, Expenses, Salary, PSP Drs and Admin dashboard. Customers use FieldMate's own email/password form; they do not need a ChatGPT account. Passwords and identity verification are handled by Supabase Auth. Records, payments and activity are stored in your own Cloudflare D1 database. Admin access is based on the configured verified owner's UUID, never a browser flag or an email claim. Self-service Create account is included with email confirmation and PKCE. Payment recording for the PKR 1,000 monthly plan is manual and does not enforce expiry.

## Accounts needed before publication

1. Create a Cloudflare account on the Workers Free plan: https://dash.cloudflare.com/sign-up
2. Create a Supabase account and Free project: https://supabase.com/dashboard
3. Both accounts must belong to the FieldMate owner. Stay on Free plans and do not enable paid upgrades. Free services have quotas and availability limits; this package does not promise unlimited hosting.

## Deploy from a computer

Requires Node 22.13+ and pnpm 11.25.0. The included lockfile pins the dependency versions that passed the build.

```sh
corepack pnpm install --frozen-lockfile
npx wrangler login
npx wrangler d1 create fieldmate
```

Replace ONLY the placeholder `database_id` in `wrangler.jsonc` with the returned database UUID. The `fieldmate` Worker name is local to your Cloudflare account. Keep the `DB` binding.

```sh
npx wrangler d1 migrations apply fieldmate --remote --config wrangler.jsonc
```

In Supabase, enable Email/Password authentication and public sign-up. Keep Confirm email ON. Set Site URL to the actual deployed origin, and add the exact HTTPS /auth/confirm URL to Redirect URLs. The signup request uses PKCE and the confirmation callback performs the token exchange; confirmation must finish in the browser that started signup. Enable provider rate limits and CAPTCHA as needed for public traffic. No OAuth or social login is required.

IMPORTANT: Supabase built-in email delivery is for testing and normally sends only to organization team-member addresses, with low project-wide limits. Configure a custom SMTP service or Send Email hook before accepting customer registrations. This package has NOT configured an email provider, changed hosted Auth settings, sent test emails or verified customer email delivery. Do not advertise signup as live until those checks pass.

The owner and customers can register from FieldMate after deployment and email setup. For administrative provisioning, an optional `scripts/create-user.mjs` is included. It uses a local administrative Supabase service-role key only. It does not print passwords or retain them in files. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY securely in the local shell, then send one JSON object on stdin with email, name and a unique password of 12–128 characters. Verify the customer's identity before provisioning. Deliver initial credentials privately. Do not paste service-role keys or passwords into chat. Clear the shell variables after provisioning. The returned owner's UUID is ADMIN_USER_ID.

Set the three runtime values using Wrangler's interactive secret prompts:

```sh
npx wrangler secret put SUPABASE_URL --config wrangler.jsonc
npx wrangler secret put SUPABASE_PUBLISHABLE_KEY --config wrangler.jsonc
npx wrangler secret put ADMIN_USER_ID --config wrangler.jsonc
pnpm typecheck
pnpm build
pnpm deploy
```

Use the publishable/anon key, never a service-role key, for SUPABASE_PUBLISHABLE_KEY. The service-role key is not needed by the deployed application. A .dev.vars.example file documents configuration names but contains no live values.

Cloudflare returns the actual workers.dev URL after deployment. A paid domain is optional. No new URL exists yet. Check a real owner sign-in, a real customer sign-in, token refresh, sign-out, private record access, payment save and Admin authorization before sharing the new URL.

## Bring existing records across

In the CURRENT FieldMate, open a section with Export and download your JSON backup. That export contains your own account's records. Keep it private. After creating the verified new owner account, convert the backup:

```sh
node scripts/prepare-import.mjs /private/backup.json VERIFIED_OWNER_UUID /private/import.sql
npx wrangler d1 execute fieldmate --remote --config wrangler.jsonc --file /private/import.sql
```

The converter namespaces every record under the NEW verified owner UUID and inserts without overwriting matching records. It accepts only existing data kinds. It does not copy old access grants, passwords or login sessions. The prepared SQL is private and must never be added to a public repository. Import into the NEW database only. Check row counts and financial totals before switching customers. Current records have not been exported or migrated by this package.

## Verification completed

- TypeScript check passed.
- Production Vite/Cloudflare Worker build passed.
- Tests passed for provider-verified identity, rejection of absent/forged tokens, Secure HttpOnly session cookies, customer data isolation, admin access restrictions, input validation and Pakistan activity-day boundaries.
- SQLite migrations were applied to an empty in-memory database successfully.
- Provider account creation, live identity-provider login, actual data migration and external deployment remain pending account access. No end-to-end deployment test has been claimed.

## Commands

`pnpm dev`, `pnpm build`, `pnpm deploy`, `pnpm typecheck`.

Local HTTPS is required for Secure session cookies. For local development, supply .dev.vars and run Wrangler's local HTTPS mode after building; do not weaken production cookies.

```sh
npx wrangler dev --config dist/server/wrangler.json --local --local-protocol https
```

## Tests

```sh
node tests/self-signup.mjs
node tests/independent-auth.mjs
node tests/account-isolation.mjs
node tests/admin-access.mjs
```

The authentication provider enforces password rate limits. Password reset is administered through Supabase; a self-service reset flow is not included. Self-service signup is included and requires configured email delivery and confirmation redirects. Expired plans are informational only. Activity tracking begins on the new deployment's first use.
