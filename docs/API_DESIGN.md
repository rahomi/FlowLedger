# API Design

This document defines the public REST API for the **Finance Manager** backend (NestJS). All endpoints are versioned under `/api/v1` and return JSON payloads. Types are shared with the frontend via the `packages/dto` TypeScript definitions.

---

## 1. General Conventions

| Aspect | Convention |
|--------|------------|
| **Base URL** | `https://<host>/api/v1` |
| **Content‑Type** | `application/json` for request/response bodies; `multipart/form-data` for file uploads |
| **Authentication** | Future phases – JWT bearer token (`Authorization: Bearer <jwt>`). All current MVP endpoints are unauthenticated (single‑user mode). |
| **Pagination** | `GET` collection endpoints support `?page=1&limit=20`. Default `limit=20`.
| **Filtering** | Query parameters follow the pattern `?field=value`. For ranges use `fieldFrom`/`fieldTo` (e.g., `dateFrom=2023‑01‑01`). |
| **Sorting** | `?sort=field` (ascending) or `?sort=-field` (descending). |
| **Soft Delete** | Deleting a resource sets `deleted_at` timestamp; the endpoint returns `204 No Content`. Soft‑deleted records are excluded from normal reads. |
| **Error Shape** | `{ "statusCode": number, "message": string | string[], "error": string }` (NestJS default). |

All responses include `created_at` and `updated_at` timestamps in ISO 8601 UTC.

---

## 2. Modules & Endpoints

### 2.1 Businesses
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/businesses` | List businesses (supports pagination & `name` search). |
| `POST` | `/businesses` | Create a new business. |
| `GET` | `/businesses/:id` | Retrieve a business (includes summary stats). |
| `PATCH` | `/businesses/:id` | Update fields. |
| `DELETE` | `/businesses/:id` | Soft delete. |
| `GET` | `/businesses/:id/summary` | Dashboard metrics for the business (income, expense, profit). |

### 2.2 Profiles (Contacts)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/profiles` | List/search profiles (`?q=` for name/email/phone). |
| `POST` | `/profiles` | Create profile. |
| `GET` | `/profiles/:id` | Profile details + linked transactions. |
| `PATCH` | `/profiles/:id` | Update. |
| `DELETE` | `/profiles/:id` | Soft delete. |

### 2.3 Transactions
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/transactions` | List with rich filters: `type`, `category`, `dateFrom`, `dateTo`, `profileId`, `businessId`, `amountMin`, `amountMax`, `sort`. |
| `POST` | `/transactions` | Create transaction. Required fields: `type`, `amount`, `date`, `category`. Optional: `description`, `profileId`, `businessId`, `attachmentIds`. |
| `GET` | `/transactions/:id` | Retrieve a transaction (including attachment metadata). |
| `PATCH` | `/transactions/:id` | Update any mutable field. |
| `DELETE` | `/transactions/:id` | Soft delete. |
| `GET` | `/transactions/recent` | Shortcut – latest 10 transactions (used by dashboard). |

### 2.4 Loans
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/loans` | List loans with filters (`status`, `profileId`, `dateFrom`, `dateTo`). |
| `POST` | `/loans` | Create loan record. |
| `GET` | `/loans/:id` | Loan detail + repayment history. |
| `PATCH` | `/loans/:id` | Update loan (e.g., change due date). |
| `DELETE` | `/loans/:id` | Soft delete. |
| `POST` | `/loans/:id/repayments` | Record a repayment – creates a linked `repayment_made` transaction and updates `paid_amount`. |

### 2.5 Attachments
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/attachments` | Upload a file. Multipart body with `file` and `entityType` / `entityId`. Size limit 10 MB, validated MIME type. |
| `GET` | `/attachments/:id` | Download file (streamed). |
| `DELETE` | `/attachments/:id` | Delete attachment (soft delete not needed – physical removal). |

### 2.6 Reports
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/reports/income` | Monthly income grouped by category. Supports `?businessId=` and date range params. |
| `GET` | `/reports/expense` | Monthly expense grouped by category. |
| `GET` | `/reports/profit-loss` | Income vs expense per period. |
| `GET` | `/reports/loans` | Loan overview (status, amounts). |
| `GET` | `/reports/business/:id` | Business‑specific P&L. |
| `GET` | `/reports/profile/:id` | Activity for a profile. |
| `GET` | `/reports/export` | Export any report to `format=pdf|csv`. Query mirrors the specific report endpoint plus `format`. |

### 2.7 Dashboard
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/dashboard` | High‑level summary (balance, totals, loan overview). |
| `GET` | `/dashboard/trends` | Income/expense trend series for the last N months. |
| `GET` | `/dashboard/categories` | Category breakdown for the selected date range. |
| `GET` | `/dashboard/sync-status` | Current sync state (`idle`, `pending`, `error`). |

---

## 3. Request / Response DTOs (shared via `packages/dto`)

Below are representative TypeScript interfaces; the same definitions are used on the client.

```ts
// enums.ts (packages/types)
export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
  LoanGiven = 'loan_given',
  LoanTaken = 'loan_taken',
  RepaymentReceived = 'repayment_received',
  RepaymentMade = 'repayment_made',
}
export enum LoanStatus { Active = 'active', Paid = 'paid', Overdue = 'overdue' }
export enum ProfileType { Person = 'person', Business = 'business', Organization = 'organization', Other = 'other' }
export enum EntityType { Transaction = 'transaction', Profile = 'profile', Loan = 'loan', Business = 'business' }
```

```ts
// transaction.dto.ts
export interface CreateTransactionDto {
  type: TransactionType;
  amount: number; // cents
  date: string; // ISO date (UTC)
  category: string;
  description?: string;
  profileId?: string; // UUID
  businessId?: string;
  loanId?: string;
  attachmentIds?: string[];
}
export interface TransactionResponseDto extends CreateTransactionDto {
  id: string;
  isReconciled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
```

```ts
// loan.dto.ts
export interface CreateLoanDto {
  type: 'given' | 'taken';
  principalAmount: number; // cents
  startDate: string; // ISO date
  dueDate?: string;
  lenderProfileId: string;
  borrowerProfileId: string;
  description?: string;
}
export interface LoanResponseDto extends CreateLoanDto {
  id: string;
  paidAmount: number;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
```

```ts
// pagination.dto.ts
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

All DTOs use class‑validator decorators in NestJS to enforce AC‑1 (cents, required fields, UUID format).

---

## 4. Versioning & Compatibility

- The API path includes `v1`. Future breaking changes will be introduced under a new version (`v2`).
- Backwards‑compatible additions (new optional fields, new endpoints) may be added to `v1`.
- Deprecation warnings will be communicated via HTTP `Warning` headers.

---

## 5. Security & Validation (NFR‑4)

- **HTTPS‑only** – enforced at the reverse proxy/load balancer.
- **Input validation** – all incoming payloads pass through NestJS pipes (`class-validator`).
- **SQL injection protection** – TypeORM parameterised queries.
- **File uploads** – MIME‑type whitelist (`image/jpeg`, `image/png`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats‑officedocument.wordprocessingml.document`). Size limited to 10 MB.
- **Rate limiting** – basic IP‑based limit (future phase).

---

*Document version: 1.0 – Updated 2026‑07‑23*