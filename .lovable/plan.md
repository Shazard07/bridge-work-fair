## Goal
Collect additional worker info at signup: education & certifications, Singapore experience, other-country experience, last drawn salary, expected salary.

## Database changes (`worker_profiles`)
Add nullable columns:
- `education` text — free-form (e.g. "High school", "Diploma in welding")
- `certifications` text — free-form list (e.g. "WSH, Forklift license")
- `sg_experience_years` numeric — years worked in Singapore
- `sg_experience_period` text — optional period note (e.g. "2019–2024")
- `other_experience_years` numeric — years worked outside Singapore
- `other_experience_period` text — optional period note
- `last_drawn_salary` integer — SGD/month
- `expected_salary` integer — SGD/month

All optional so existing rows stay valid. No RLS changes needed (existing policies cover them).

## UI changes (`src/routes/signup.worker.tsx`)
Add a new section "Experience & salary" below the existing skills field with these inputs:

```text
Education
Certifications (optional)

Singapore experience (years)   Period (e.g. 2019–2024)
Other experience (years)       Period (e.g. 2015–2019)

Last drawn salary (SGD/month)
Expected salary (SGD/month)
```

- Extend `form` state with the new fields (all strings, parsed on submit).
- On submit, include them in the `worker_profiles` insert payload (empty → `null`, numbers parsed via `parseInt`/`parseFloat`).
- Keep current styling (`Field` component); no validation beyond existing required flags. All new fields optional.

## Out of scope
- Worker dashboard / company-facing display of these fields (can be added in a follow-up).
- No changes to job posting flow.
