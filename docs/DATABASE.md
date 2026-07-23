# Database Design

This document captures the relational schema for the Finance Manager application, the indexes that support the required queries, and the rationale behind key modeling choices.

---

## 1. Entity Overview

| Entity | Primary Key | Description |
|--------|-------------|-------------|
| **users** (future) | `id` (UUID) | Authentication accounts (not in MVP). |
| **businesses** | `id` (UUID) | Represents a distinct business entity. |
| **profiles** | `id` (UUID) | Contacts (people, organizations, other). |
| **transactions** | `id` (UUID) | Financial movements – income, expense, loan activity. |
| **loans** | `id` (UUID) | Loan records – given or taken, with repayment tracking. |
| **attachments** | `id` (UUID) | Files linked to any entity (transaction, profile, loan, business). |

The core of the model mirrors the **Core Modules** table in the PRD. All monetary values are stored as **integer cents** (see AC‑1) to avoid floating‑point rounding errors.

---

## 2. Table Definitions (PostgreSQL – TypeORM compatible)

```sql
-- USERS (Future Phase)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BUSINESSES
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('person','business','organization','other')),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- TRANSACTIONS
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'income','expense','loan_given','loan_taken','repayment_received','repayment_made'
    )),
    amount INTEGER NOT NULL CHECK (amount >= 0),
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    loan_id UUID REFERENCES loans(id) ON DELETE SET NULL,
    is_reconciled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- LOANS
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(10) NOT NULL CHECK (type IN ('given','taken')),
    principal_amount INTEGER NOT NULL CHECK (principal_amount > 0),
    paid_amount INTEGER DEFAULT 0 CHECK (paid_amount >= 0),
    start_date DATE NOT NULL,
    due_date DATE,
    lender_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    borrower_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','paid','overdue')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ATTACHMENTS
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('transaction','profile','loan','business')),
    entity_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Indexes (performance‑critical)

| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_transactions_date` | `date` | Date range filters, dashboard trends |
| `idx_transactions_type` | `type` | Quick filtering by transaction type |
| `idx_transactions_category` | `category` | Category breakdown chart |
| `idx_transactions_profile` | `profile_id` | Profile activity reports |
| `idx_transactions_business` | `business_id` | Business‑specific reports |
| `idx_transactions_loan` | `loan_id` | Loan repayment lookup |
| `idx_transactions_deleted` | `deleted_at` | Exclude soft‑deleted rows efficiently |
| `idx_loans_status` | `status` | Overdue loan alerts |
| `idx_loans_due_date` | `due_date` | Sync / reminder calculations |
| `idx_profiles_name` | `name` | Profile search autocomplete |
| `idx_attachments_entity` | `(entity_type, entity_id)` | Fast attachment lookup per entity |

---

## 4. Views for Dashboard

```sql
CREATE VIEW v_dashboard_summary AS
SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) AS total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) -
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) AS net_balance
FROM transactions
WHERE deleted_at IS NULL;

CREATE VIEW v_loan_summary AS
SELECT 
    type,
    COUNT(*) AS loan_count,
    SUM(principal_amount) AS total_principal,
    SUM(paid_amount) AS total_paid,
    SUM(principal_amount - paid_amount) AS total_outstanding
FROM loans
WHERE deleted_at IS NULL AND status != 'paid'
GROUP BY type;
```

These views are materialized‑read‑only; they power the dashboard API without extra calculation overhead.

---

## 5. Migration Strategy

- **Initial migration** creates all tables and indexes.
- Future migrations add columns (e.g., `is_favourite` on profiles) while preserving existing data.
- Migrations are version‑controlled under `packages/db/migrations` and run automatically on deployment.

---

*Document version: 1.0 – Updated 2026‑07‑23*