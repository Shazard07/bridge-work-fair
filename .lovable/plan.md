
## Goal
Block obvious fake company signups by enforcing two rules on `src/routes/signup.company.tsx`:
1. **UEN** matches a valid Singapore UEN format.
2. **Email** uses a company domain (no free webmail providers).

Frontend-only change. No DB schema changes.

---

## 1. UEN format validation

Singapore UENs come in three official shapes (ACRA spec):

- **Businesses (ROB)** — 8 digits + 1 letter → `NNNNNNNNX` (e.g. `12345678A`)
- **Local companies (ROC)** — 4 digits + 5 digits/letters + 1 letter → `YYYYNNNNNX` where YYYY is year of issuance (e.g. `201912345A`)
- **Other entities (e.g. societies, LLPs, gov)** — `TyyPQNNNNX` or `SyyPQNNNNX` — letter `T`/`S` + 2-digit year + 2-letter entity type + 4 digits + 1 letter (e.g. `T05LL1234B`)

Combined regex:
```
^(\d{8}[A-Z]|\d{9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$
```

- Uppercase the input before testing (accept lowercase entry but normalize).
- Show inline error under the UEN field: "Enter a valid Singapore UEN (e.g. 201912345A or T05LL1234B)".
- Block submit if invalid.

## 2. Company email domain

- Extract domain from email (everything after `@`, lowercased).
- Reject if domain is in a blocklist of free providers:
  `gmail.com, googlemail.com, yahoo.com, yahoo.com.sg, hotmail.com, hotmail.sg, outlook.com, live.com, msn.com, icloud.com, me.com, aol.com, proton.me, protonmail.com, qq.com, 163.com, 126.com, mail.com, zoho.com, gmx.com, yandex.com`
- Show inline error: "Please use your company email address — free email providers aren't accepted."
- Block submit.

Keep the blocklist as a `FREE_EMAIL_DOMAINS` const at the top of the signup file (easy to extend later).

## 3. UX details

- Validate on submit (not on every keystroke) — show field-level errors via small red text under each input.
- Keep existing top-of-form `err` state for backend errors; add separate `fieldErrors: { uen?: string; email?: string }` state for these client-side checks.
- Trim + uppercase UEN before sending to DB so it stores canonically.
- Trim + lowercase email before sending.

## 4. Out of scope (mentioned earlier, not in this change)
- UEN uniqueness constraint in DB
- ACRA BizFile API lookup
- Manual verification gate / `verified` flag
- Phone OTP

These are still good next steps but not part of this task.

---

## Files touched
- `src/routes/signup.company.tsx` — add validators, field-error state, normalize values before insert.
