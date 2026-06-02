## Goal
Replace the single salary range + period dropdown with two separate salary ranges: one monthly, one daily. Both visible at all times, neither required.

## UI changes (`src/routes/company.jobs.new.tsx`)
Replace the current salary block (Min/Max SGD grid + Salary period select) with:

```text
Min salary (SGD/month)   Max salary (SGD/month)
Min salary (SGD/day)     Max salary (SGD/day)
```

- Remove the `Salary period` `<Select>` and the `SALARY_PERIODS` constant.
- Form state: drop `salaryPeriod`; add `minSalaryDay` and `maxSalaryDay` (keep existing `minSalary` / `maxSalary` as the monthly values).
- All four fields remain optional.

## Data changes
- Migration on `jobs`: add `min_salary_day int`, `max_salary_day int` (nullable). Drop `salary_period` column and the `salary_period` enum (no longer used).
- Insert payload maps: `min_salary` / `max_salary` = monthly inputs; `min_salary_day` / `max_salary_day` = daily inputs.

## Worker dashboard (`src/routes/worker.index.tsx`)
Update `Job` type and salary display: show "SGD X–Y/month" when monthly values exist and "SGD X–Y/day" when daily values exist (both lines can show if both are set). Remove the `salary_period` field.

## Out of scope
No changes to other fields, validation, or styling.