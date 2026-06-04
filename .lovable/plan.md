## Goal

Lock down worker data so one worker cannot see another worker's information, while still letting companies (once re-enabled) browse worker profiles. Sensitive contact info (phone — and passport / work permit / port pass once added) is hidden from everyone except the worker themselves and companies that have saved or contacted them.

Today every public table has RLS **off**, so any signed-in user can read or modify any row through the Data API. This must be fixed before the first real worker signs up.

## Access model

| Data | Worker (self) | Other workers | Company (saved/contacted this worker) | Company (other) |
|---|---|---|---|---|
| Own `profiles` row (name, role) | read/write | hidden | name visible | name visible |
| Phone (on `profiles`) | read/write | hidden | visible | hidden |
| `worker_profiles` (skills, experience, salary, nationality, sector, availability) | read/write | hidden | read | read |
| Passport / work permit / port pass (future fields) | read/write | hidden | read | hidden |
| `company_profiles` | own row read/write | n/a | n/a | own row only |
| `saved_workers` | worker can see who saved them (count only via server fn) | hidden | company sees own rows | own rows only |
| `worker_contacts` | worker reads messages addressed to them | hidden | company sees own outgoing | own rows only |

## Plan

### 1. User-role helper
Add `app_role` enum (`worker`, `company`) and a `user_roles` table populated from the existing `profiles.role` at migration time (and kept in sync going forward). Add `public.has_role(_user_id, _role)` as a `SECURITY DEFINER` function so RLS policies can check role without recursion.

(We use a separate `user_roles` table per platform convention — never check role from inside an RLS policy on `profiles` itself.)

### 2. Split sensitive fields off `profiles`
`profiles.phone` is the only contact field today, but it sits on a table that has to be partially readable by companies (name). Two clean options:

- **Move `phone` into `worker_profiles`** (worker-only data anyway) and let `profiles` stay name/role only. Simpler policies, recommended.
- Keep `phone` on `profiles` but expose `profiles` via a public view that excludes `phone`, and force all reads through the view.

Plan picks **move phone to `worker_profiles`**. Future fields (passport, work permit, port pass) will be added to `worker_profiles` directly.

### 3. Enable RLS + policies

`profiles`
- Worker/company can SELECT/UPDATE only their own row (`auth.uid() = user_id`).
- Authenticated users can SELECT the name+role of any profile (needed so a company can see a worker's name). Achieved by leaving SELECT open to `authenticated` since `phone` has been moved off.

`worker_profiles`
- Worker SELECT/INSERT/UPDATE/DELETE own row.
- Companies (`has_role(auth.uid(),'company')`) SELECT non-sensitive columns of any worker. Sensitive columns (phone, and future passport / work permit / port pass) are hidden via a **`worker_profiles_public` view** that excludes them. RLS on the base table denies cross-user SELECT; the view is `security_invoker=on` and grants SELECT to companies.
- A server function `getWorkerContact(workerId)` returns sensitive fields only if a `saved_workers` or `worker_contacts` row links the calling company to that worker.

`company_profiles`
- Company SELECT/INSERT/UPDATE own row. No cross-company reads. Workers cannot read it (until we design a "who's hiring" view later).

`saved_workers`
- Company SELECT/INSERT/DELETE own rows (`company_id = auth.uid()`).
- Worker cannot read this table directly.

`worker_contacts`
- Company INSERT/SELECT own outgoing rows.
- Worker SELECT rows where `worker_id = auth.uid()`.

### 4. GRANTs
For every table touched: `GRANT ... TO authenticated`, `GRANT ALL TO service_role`, no `anon`. For the `worker_profiles_public` view: `GRANT SELECT TO authenticated`.

### 5. Code changes that follow the schema change
- Worker signup + profile edit: write phone into `worker_profiles` instead of `profiles`.
- Worker dashboard / profile read: read phone from `worker_profiles`.
- Any company-facing browse UI (when re-enabled): read from `worker_profiles_public`, not the base table.
- New server fn `getWorkerContact` for the reveal-after-save flow.

### 6. Verify
- Run the Supabase linter after migration; resolve any flagged issues.
- Manual check: sign in as worker A, attempt `supabase.from('worker_profiles').select('*')` in the browser console — should return only A's row.

## Technical details

- All policy changes go through a single migration that creates `app_role`, `user_roles`, `has_role()`, backfills roles from `profiles.role`, moves `phone` column, enables RLS, and creates policies + view + grants in order.
- `worker_profiles_public` view uses `security_invoker=on` so RLS on the base table still applies; its SELECT policy on the base table allows companies to read non-sensitive columns (or we deny base SELECT to non-owners entirely and rely on the view's grant — preferred for defence-in-depth).
- No data loss: `phone` column is moved with `INSERT ... SELECT` then dropped from `profiles` in the same migration.

## Out of scope (for this plan)

- Adding the new worker fields (passport, work permit, port pass, profile photo) and storage bucket — separate task.
- Re-enabling company signup — separate task.
- Admin role / moderation — not needed yet.