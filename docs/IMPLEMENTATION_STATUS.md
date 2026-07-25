# Implementation Status

Updated: 2026-07-26

## Completed In This Pass

1. Dashboard trends now return a six-month time series even when some months have no transactions.
2. Added `/api/v1/reports/expense` for expense totals grouped by category, with optional business filtering.
3. Added `/api/v1/reports/business/:id` for date-range-filtered business profit/loss and transaction detail.
4. Added `/profiles/:id/transactions` to list all transactions linked to a profile.
5. Added optional `type` filtering to `/profiles/:id/transactions`.

## Verification

- Focused Jest specs updated and passing for dashboard, reports, and profiles services.
- API design and PRD checklist updated to reflect the completed backend tasks.

## Remaining Nearby Gaps

- Profile totals sent/received are still not exposed.
- Report export endpoints are still not implemented.
- Category drill-down from dashboard to related transactions is still not implemented.