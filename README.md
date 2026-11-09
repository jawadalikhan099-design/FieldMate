# FieldMate — Netlify + Supabase

Independent email/password sales workspace. No ChatGPT account required.

## Deployment
Import this GitHub repository into Netlify. `netlify.toml` configures `pnpm build`, `.next`, Node 22 and the public Supabase connection settings. Netlify automatically adds its Next.js adapter. No Cloudflare account or D1 database is used by this version.

The Supabase schema in `database/netlify-schema.sql` has already been applied to the connected project. Do not rerun it. All tables have RLS; requests use the signed-in user token, never a service key. Records are isolated by owner. The verified owner email bootstraps admin access through a restricted server-side function; user metadata cannot grant admin.

After deployment, set the Supabase Auth Site URL to the actual HTTPS Netlify URL and add its exact `/auth/confirm` URL to the redirect allowlist. Configure custom SMTP before inviting customer email addresses (default Supabase email delivery is restricted). These account settings are still required; deployment alone does not enable customer confirmation email.

Run `pnpm check` and `pnpm build`. Existing Cloudflare scripts/config and SQLite migrations are retained for history but are not the Netlify deployment path. Existing personal records were not copied into this independent database.
