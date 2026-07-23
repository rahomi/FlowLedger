# Project Development Rules

## Project

Offline-first personal and small-business finance manager.

## Core principles

- Offline-first is a core requirement.
- Never lose locally created financial data.
- Monetary values must use integer minor units.
- Use soft deletion for financial records.
- Never use floating-point arithmetic for money.
- Maintain strict separation between personal and business finances.
- All sync operations must be idempotent.
- Prefer simple, maintainable architecture over unnecessary abstraction.

## Development workflow

For every task:

1. Read the relevant requirements and existing code.
2. Inspect related modules before making changes.
3. Implement the smallest complete solution.
4. Add or update tests.
5. Run formatting and linting.
6. Run relevant tests.
7. Run the build.
8. Fix all errors.
9. Re-run verification.
10. Update documentation when architecture or behavior changes.
11. Mark the task complete only after verification.

Do not stop after creating a plan.

Do not stop after finding an error.

If a test fails, investigate and fix it.

Do not ask for confirmation for normal implementation decisions.

Ask for clarification only when:
- A requirement is genuinely contradictory.
- A destructive action is unavoidable.
- Required information is completely missing.

## Definition of Done

A task is complete only when:

- Implementation is complete.
- Tests pass.
- Type checking passes.
- Linting passes.
- Build succeeds.
- No known errors remain.
- Documentation is updated when necessary.