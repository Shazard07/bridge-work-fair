
## Goal
Pivot from a job marketplace to a **verified worker discovery platform**. Companies search and contact workers directly. No jobs, no applications, no payments.

---

## 1. Database changes

### Drop (no longer needed)
- Table `jobs`
- Table `applications`
- Enum `application_status`
- Enum `work_pass_type` (if only used by jobs)

### Update `worker_profiles` — add columns
- `available_now` boolean, default `true`
- `available_from` date, nullable (optional "available from" date)
- `sg_experiences` jsonb, default `'[]'` — array of `{ role, company, start_year, end_year }`
- `overseas_experiences` jsonb, default `'[]'` — array of `{ country, role, company, start_year, end_year }`
- Drop the old flat experience columns: `sg_experience_years`, `sg_experience_period`, `other_experience_years`, `other_experience_period` (replaced by structured jsonb above)
- Keep: `education`, `certifications`, `last_drawn_salary`, `expected_salary`, `nationality`, `language`, `sector`, `skills`, `work_pass_end_date`, `date_of_birth`

### New table: `saved_workers` (company bookmarks)
- `id uuid pk`, `company_id uuid`, `worker_id uuid`, `created_at timestamptz`
- Unique `(company_id, worker_id)`
- RLS: company can select/insert/delete their own rows only

### New table: `worker_contacts` (log of "contact worker" actions)
- `id uuid pk`, `company_id uuid`, `worker_id uuid`, `message text nullable`, `created_at timestamptz`
- RLS: company inserts own; company sees own; worker sees contacts directed at them

### RLS adjustments
- Existing `worker_profiles_select_companies` policy already restricts profile visibility to logged-in company accounts — keep as-is. Workers continue to see their own profile.

---

## 2. UI changes

### Remove
- `src/routes/company.jobs.new.tsx` (delete file + route)
- "Post Job" CTA and "My Jobs" / "Applications" tabs from company dashboard
- Worker dashboard job-browse + "Apply" + "My Applications" flow

### Worker signup (`src/routes/signup.worker.tsx`)
Replace the current flat experience fields with a cleaner enterprise-style layout:

- **Availability card**
  - "Available now" toggle
  - Optional "Available from" date (shown when toggle off)

- **Education & Certifications card** (keep existing fields, restyle)

- **Experience in Singapore card**
  - Dynamic list of entries: Role/Trade, Company, Start year, End year
  - "+ Add Singapore experience" button
  - Duration auto-calculated and shown per entry + total

- **Experience Outside Singapore card**
  - Dynamic list of entries: Country (dropdown), Role/Trade, Company, Start year, End year
  - "+ Add overseas experience" button
  - Duration auto-calculated per entry

- **Salary card** (last drawn / expected — keep)

Visual polish: card-based grouping, consistent spacing, clearer labels, year dropdowns instead of free-text.

### Worker dashboard (`src/routes/worker.index.tsx`)
Replace job browser with a **profile management view**:
- Availability toggle (quick update)
- Summary of their own profile
- "Edit profile" link
- List of companies that have contacted them (from `worker_contacts`)

### Company dashboard (`src/routes/company.index.tsx`)
Rebuild around worker discovery:

- **Tabs**: "Browse workers" (default) · "Saved" · "Contacted"
- **Search bar** + **filters sidebar/bar**:
  - Trade / sector (Construction, Marine)
  - Years of experience (range)
  - Nationality (multi)
  - Availability (Available now / Available from date)
  - Certifications (text contains)
  - Has Singapore experience (toggle)
- **Worker cards** showing: name, sector badge, trust indicators (work pass valid, years exp, SG experience years, certifications count), "Available now" badge, Save (bookmark) button, "View profile" button
- **Worker profile detail** (modal or `/company/workers/$id` route): full structured experience, education, certifications, expected salary, **Contact** button (logs to `worker_contacts`, reveals contact info from `profiles.phone`)
- **Saved tab**: bookmarked workers
- **Contacted tab**: workers the company has contacted

Privacy: never show FIN, passport, address, DOB — only show year of birth / age range if anything. Date of birth column stays in DB but is not surfaced in company-facing UI.

### Landing (`src/routes/index.tsx`)
Update copy to reflect "find verified workers" instead of "post jobs". Free during MVP banner.

---

## 3. Technical notes

- `jsonb` experience arrays are simpler than separate child tables for this MVP and keep signup as a single insert. Filtering by SG-experience presence uses `jsonb_array_length(sg_experiences) > 0`.
- Duration calculation is purely client-side (`end_year - start_year`); store raw years.
- Country list: hardcoded constant in frontend (top ~30 source countries: Bangladesh, India, China, Myanmar, Philippines, Indonesia, Malaysia, Thailand, Vietnam, etc.).
- Year dropdown: current year back to 1980.
- Types file (`src/integrations/supabase/types.ts`) regenerates automatically after migration.

---

## Out of scope
- Verification workflow (badge UI only; manual verification later)
- Messaging system (contact = reveal phone + log)
- Worker photo uploads
- Admin tools
