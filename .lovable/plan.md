
# BridgeWork pivot — Worker-only profile platform

Strip out all agent/job-matching surfaces and rebuild around a single goal: help a Tamil migrant worker in Singapore build and maintain a digital work profile on their phone.

## Scope changes vs current app

**Remove**
- All `/agent/*` routes (dashboard, jobs/new, workers, workers/$id, pipeline)
- `/signup.agent`, agent signup flow
- `/worker/jobs`, `/worker/jobs/$id`, `/worker/applications` (no job browsing or applications)
- Agent role + agent nav from `AppShell` (single role: `worker`)
- Agent mock data (`AGENTS`, `JOBS`, `APPLICATIONS`, `NOTIFICATIONS_AGENT`, pipeline stages)
- Landing page's dual-CTA ("I'm an Agent" / "I'm a Worker") — replace with single CTA
- Fee comparison vs agent fees framing → simpler "Free for workers. Always."

**Keep / refactor**
- `LangProvider` + `LangToggle` (EN / தமிழ்) — surface on every page top-right
- `AppShell` simplified to worker-only nav: Dashboard, Profile, Certifications Guide
- Deep blue `#1B3A6B` + warm orange `#F4845F`, Noto Sans Tamil, mobile-first
- Existing wellbeing concept moves to a dashboard card + dedicated page

**Add**
- Worker login route (in addition to existing signup)
- Profile builder expanded from current to 5 specific steps with new fields (WP number, current address, employer, contract end, certifications cards, availability)
- Worker dashboard rebuilt around: Profile Completion, Contract Countdown, Certification Status, Visibility Toggle, Profile Views (mock), Referral, Wellbeing prompt
- Worker profile view page (`/worker/profile/view`) — what they/agents would see
- Certification guide page (`/guide/certifications`)
- Wellbeing check-in page (`/worker/wellbeing`)

## Page / route map

| Route | Purpose |
|---|---|
| `/` | New landing (hero, why, how, fee promise, testimonials, footer) |
| `/signup` | Worker signup (name, email, password, SG phone) |
| `/login` | Worker login |
| `/worker` | Dashboard |
| `/worker/profile` | Multi-step builder (5 steps) |
| `/worker/profile/view` | Read-only profile view |
| `/worker/wellbeing` | Wellbeing check-in |
| `/guide/certifications` | Cert guide table |

Old agent + jobs route files deleted; route tree auto-regens.

## Data model (mock, in `src/lib/data.ts`)

Replace existing types with:

```text
WorkerProfile {
  personal: { fullName, dob, phone, district, sgAddress, wpNumber, wpExpiry, employer, contractEnd }
  experience: { sector, jobTitle, yearsBand, previousEmployers[≤3], skillsText }
  certifications: { CSOC, Welding, Crane, Forklift, FirstAid, BizSAFE, Other[]:
                    { uploadedFileName?, expiryDate?, noExpiry?, status: derived } }
  availability: { contractEnd, availableFrom, status: derived, nextSector, duration, openTo, notes }
  visibility: boolean
}
```

Job-title options conditional on sector (Construction vs Marine lists from spec).
Seed 8 mock workers per the brief; the "current user" is `w1` (Murugan R.).

Derivations:
- Cert status: `noExpiry` → Valid; else `expiry < today` → Expired, `< today+90d` → Expiring Soon, else Valid; missing upload → Not uploaded.
- Availability: `contractEnd <= today` → Available Now; `<= today+60d` → Available Soon; else Currently Employed.
- Profile strength %: weighted completion across the 5 steps (personal 25, experience 25, certs 30 based on uploaded count, availability 10, visibility-ready 10).
- Cert completeness %: uploaded certs / 6 standard types.

State is held in `localStorage` (`bw_profile`) so the builder + dashboard share data without a backend.

## Landing page

Sections in order:
1. Header (logo, EN/தமிழ் toggle, Login link)
2. Hero — headline (EN/Tamil), subhead, single CTA "Create Your Free Profile" → `/signup`
3. Why it matters — 3 icon cards (prove skills / one place / no broker fees)
4. How it works — 3 numbered steps
5. Fee promise band — "Free for workers. Always." / "எப்போதும் இலவசம்."
6. 3 testimonials (Murugan, Selvam, Anand — exact quotes)
7. Footer with MOM + MWC helplines

No stock photos; lucide icons + simple shapes.

## Profile builder (`/worker/profile`)

Single route with internal step state (1–5), sticky progress bar, mobile-first single-column. Steps as in brief. Step 3 renders a card per cert type with: filename capture (input type=file, store name only), expiry date or "No expiry" checkbox, auto status badge, cert completeness meter at top. Step 5 shows summary, strength meter, missing-fields list, visibility toggle (default off), submit.

## Worker dashboard

Cards (stacked on mobile, 2-col on ≥md):
- Profile Completion (circular meter, missing-items list, CTA to builder)
- Contract Countdown (days remaining, status badge, soft prompt if <60d)
- Certification Status (list with status pills, expiring-soon warning)
- Visibility Toggle (on/off card with explanation copy)
- Profile Views (mock copy: "viewed 4 times this week", "2 agents saved")
- Referral (mock link, count)
- Wellbeing monthly prompt (😊/😐/😟; "Having issues" reveals textarea + 3 helplines, also links to `/worker/wellbeing`)

## Profile view page

Read-only render of the same profile data: name + sector/title badges, availability badge, years, work-history timeline, certification badges (color by status), skills text, district, availability prefs. "Edit" buttons jump back to the relevant builder step (`/worker/profile?step=2`).

## Certification guide

Static page with intro, table (CSOC, Crane, Forklift, Welding, First Aid — columns: Who needs it / Validity / Where to renew), and closing note. Fully bilingual labels.

## Wellbeing page

Same trio of options as the dashboard card, plus expanded resource cards for MOM (6438 5122), MWC (6536 2692), TWC2 (6247 7001) with one-tap `tel:` links.

## Design / i18n details

- `AppShell` simplified: logo, nav (Dashboard / Profile / Guide), LangToggle (always visible), Sign out. Remove bell/notifications (no agent-side events).
- All worker-facing text wrapped in `t(en, ta)`; Tamil strings authored for headings, CTAs, nav, status badges, cert names where natural.
- Strength + completeness meters: animated fill, orange→blue gradient at 100%, subtle "🏆" when full.
- Cert badges: rounded tiles with icon + name + status pill; greyed out when not uploaded.

## Technical notes

- TanStack Start file-based routes; delete obsolete files in `src/routes/` so `routeTree.gen.ts` regenerates cleanly.
- No backend / Lovable Cloud needed (MVP per brief). All persistence via `localStorage`.
- Each route gets its own `head()` with EN title + description.
- `__root.tsx` retains `<Outlet />`; `AppShell` wraps page content per route.
- Keep existing shadcn primitives (Card, Button, Input, Progress, Textarea); add Select/Checkbox where needed (already in project).

## Out of scope (explicit)

No auth backend, no agent UI, no job listings, no messaging, no payments, no file storage (filename capture only).
