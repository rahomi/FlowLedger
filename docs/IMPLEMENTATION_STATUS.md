# Implementation Status

Updated: 2026-07-26

## Completed In This Pass

1. Added `totalSent` and `totalReceived` aggregates to `/profiles/:id/transactions`.
2. Added `/api/v1/dashboard/categories/transactions` for category drill-down to matching transactions.
3. Added `/api/v1/reports/export` CSV export for `expense` and `business` reports.
4. Added `/api/v1/reports/export` PDF export for `expense` and `business` reports.
5. Report exports now include transaction-level detail rows for the exported result set.

## Verification

- Focused Jest specs updated and passing for dashboard, reports, and profiles services.
- Combined focused verification passed: 3 suites, 38 tests.
- API design and PRD checklist updated to reflect the completed backend tasks.

## Remaining Nearby Gaps

- Loan overdue list filtering and richer overdue list metadata are still incomplete.
- Export coverage is currently limited to `expense` and `business` reports.
- Frontend wiring for drill-down and export actions is still absent.