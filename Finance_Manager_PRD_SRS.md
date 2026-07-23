# Personal & Business Finance Manager

## Product Requirements Document (PRD) & Light Software Requirements Specification (SRS)

**Version:** 1.0  
**Date:** 2026-06-23  
**Status:** Draft  
**Target Audience:** Solo Founder / Small Development Team

---

## 1. Product Vision

Build a fast, simple, and offline-first finance tracking application that empowers individuals and small business owners to record, manage, and understand their personal and business finances in under 10 seconds per transaction. The application bridges the gap between overly complex accounting software and basic note-taking apps, providing just enough structure for meaningful reporting without sacrificing speed.

---

## 2. Product Goals

| # | Goal | Success Metric |
|---|------|----------------|
| 1 | Enable transaction recording in under 10 seconds | Average time per transaction < 10s |
| 2 | Provide clear financial visibility via dashboard | Users check dashboard at least 3x/week |
| 3 | Support offline-first operation with seamless sync | 100% functionality offline |
| 4 | Separate personal and business finances cleanly | Zero accidental mixing in reports |
| 5 | Track loans with minimal overhead | Loan status accuracy > 99% |
| 6 | Generate actionable reports in 2 clicks | Report generation time < 3s |
| 7 | Architect for future multi-user and family sharing | Clean data model from day one |

---

## 3. User Persona

### Primary: "Quick-Record Raj"
- **Age:** 28-45
- **Role:** Freelancer / Small business owner / Salaried individual with side income
- **Tech Comfort:** High mobile usage, prefers apps that "just work"
- **Pain Points:**
  - Spreadsheets are too slow for daily entries
  - Accounting software is overkill and expensive
  - Forgets to record cash transactions
  - Can't separate personal and business expenses easily
  - Loses track of money lent to friends/family
- **Goals:**
  - Record any transaction in seconds
  - Know where money is going without analysis paralysis
  - Track who owes what
  - Generate simple reports for tax/accounting
- **Quote:** *"I just need to write down that I spent ₹500 on lunch and move on."

### Secondary: "Organized Olivia"
- **Age:** 30-50
- **Role:** Small business owner with 2-3 businesses
- **Needs:** Business-level reporting, multi-business tracking, contact management
- **Goals:** Clear P&L per business, track client payments, manage vendor expenses

---

## 4. Scope

### In Scope (MVP)
- Personal & business transaction tracking
- Profile/contact management
- Multi-business support
- Loan tracking (given & taken)
- File attachments
- Dashboard with charts
- 6 core reports
- Offline-first data storage
- REST API backend

### Out of Scope (MVP)
- Bank account integration / automatic imports
- Multi-currency support
- Recurring transactions
- Budgeting / forecasting
- Invoice generation
- Payment processing
- Real-time collaboration
- Mobile app (future phase)
- AI insights / recommendations
- Bank-level security (2FA, encryption at rest)

### Future Scope
- Multi-user accounts & family sharing
- Mobile app (iOS & Android)
- Bank API integrations
- Recurring transactions
- Budgeting features
- Advanced analytics
- Export to accounting software (QuickBooks, etc.)

---

## 5. Core Modules

```
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION                          │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  Dashboard  │ Transactions│  Profiles   │   Businesses  │
│   Module    │   Module    │   Module    │    Module     │
├─────────────┼─────────────┼─────────────┼───────────────┤
│   Loans     │  Reports    │ Attachments │     Auth      │
│   Module    │   Module    │   Module    │   (Future)    │
└─────────────┴─────────────┴─────────────┴───────────────┘
```

### Module Descriptions

| Module | Purpose | Key Entities |
|--------|---------|--------------|
| **Dashboard** | Financial overview at a glance | Aggregated metrics, charts |
| **Transactions** | CRUD for all financial entries | Transaction, Category |
| **Profiles** | Contact/entity management | Profile |
| **Businesses** | Business entity tracking | Business |
| **Loans** | Loan lifecycle management | Loan, LoanRepayment |
| **Reports** | Data analysis & export | All entities (read-only) |
| **Attachments** | File upload & association | Attachment |
| **Auth** | User management (future) | User, Account |

---

## 6. Functional Requirements

### FR-1: Transaction Management
- **FR-1.1:** Create a transaction with: amount, type, date, category, description, profile (optional), business (optional), attachment (optional)
- **FR-1.2:** Transaction types: Income, Expense, Loan Given, Loan Taken, Loan Repayment Received, Loan Repayment Made
- **FR-1.3:** Edit any transaction field post-creation
- **FR-1.4:** Soft-delete transactions (retain for reporting integrity)
- **FR-1.5:** Filter transactions by: date range, type, category, profile, business, amount range
- **FR-1.6:** Sort transactions by date (default newest first), amount, category
- **FR-1.7:** Quick-add: pre-fill today's date, default category, minimal required fields

### FR-2: Profile Management
- **FR-2.1:** Create profile with: name, phone, email, address, description, notes
- **FR-2.2:** Profile types: Person, Business, Organization, Other
- **FR-2.3:** Quick-create profile during transaction entry (inline, no navigation)
- **FR-2.4:** View all transactions linked to a profile
- **FR-2.5:** Profile completion indicator (fields filled %)
- **FR-2.6:** Search profiles by name, phone, or email

### FR-3: Business Management
- **FR-3.1:** Create multiple businesses with: name, description, logo (optional)
- **FR-3.2:** Assign transactions to a business
- **FR-3.3:** View business dashboard: income, expenses, profit/loss, transaction count
- **FR-3.4:** Filter all reports by business
- **FR-3.5:** Set a default business for quick entry

### FR-4: Loan Management
- **FR-4.1:** Create loan record with: principal, start date, due date, lender profile, borrower profile, description
- **FR-4.2:** Track loan status: Active, Paid, Overdue (auto-calculated)
- **FR-4.3:** Record repayments (linked to transaction system)
- **FR-4.4:** Calculate and display: principal, paid amount, remaining amount
- **FR-4.5:** Simple installment tracking: record each payment, update remaining
- **FR-4.6:** Loan list view with filters: status, profile, date range
- **FR-4.7:** Overdue loan alerts on dashboard

### FR-5: Dashboard
- **FR-5.1:** Display current balance (income - expenses, excluding loans)
- **FR-5.2:** Display total income, total expense, profit/loss
- **FR-5.3:** Display loans given, loans taken, outstanding loans, overdue loans
- **FR-5.4:** Show recent transactions (last 10)
- **FR-5.5:** Income trend chart (last 6 months)
- **FR-5.6:** Expense trend chart (last 6 months)
- **FR-5.7:** Category breakdown chart (pie/donut)
- **FR-5.8:** Date range selector for dashboard metrics

### FR-6: Reports
- **FR-6.1:** Monthly Income Report: grouped by category, with totals
- **FR-6.2:** Monthly Expense Report: grouped by category, with totals
- **FR-6.3:** Profit & Loss Report: income vs expense per period
- **FR-6.4:** Loan Report: all loans with status, amounts, profiles
- **FR-6.5:** Business Report: P&L per business
- **FR-6.6:** Profile Activity Report: transactions per profile
- **FR-6.7:** Export reports to PDF and CSV
- **FR-6.8:** Date range and business filters for all reports

### FR-7: Attachments
- **FR-7.1:** Upload files to: transactions, profiles, loans, businesses
- **FR-7.2:** Supported formats: images (JPG, PNG), PDF, documents (DOC, DOCX)
- **FR-7.3:** Maximum file size: 10MB per file
- **FR-7.4:** View attachments in context (transaction detail, profile page, etc.)
- **FR-7.5:** Delete attachments

### FR-8: Offline-First
- **FR-8.1:** All CRUD operations work without internet
- **FR-8.2:** Data stored locally (IndexedDB / SQLite)
- **FR-8.3:** Background sync when connection restored
- **FR-8.4:** Conflict resolution: last-write-wins with timestamp
- **FR-8.5:** Visual indicator for sync status

---

## 7. Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1:** Transaction creation < 2s on average hardware
- **NFR-1.2:** Dashboard load < 3s with 10,000 transactions
- **NFR-1.3:** Report generation < 3s
- **NFR-1.4:** Search results < 500ms
- **NFR-1.5:** App initial load < 5s on 3G

### NFR-2: Usability
- **NFR-2.1:** New user can record first transaction without tutorial
- **NFR-2.2:** All primary actions accessible within 2 clicks/taps
- **NFR-2.3:** Consistent UI patterns across all modules
- **NFR-2.4:** Keyboard shortcuts for desktop web app

### NFR-3: Reliability
- **NFR-3.1:** 99.9% uptime for backend API
- **NFR-3.2:** Zero data loss on sync failure (retry with exponential backoff)
- **NFR-3.3:** Automatic local backups (daily)

### NFR-4: Security
- **NFR-4.1:** HTTPS-only API communication
- **NFR-4.2:** Input validation and sanitization
- **NFR-4.3:** SQL injection prevention (ORM parameterized queries)
- **NFR-4.4:** XSS protection
- **NFR-4.5:** File upload validation (type, size, malware scan)

### NFR-5: Scalability
- **NFR-5.1:** Support 100,000 transactions per user
- **NFR-5.2:** Support 50 businesses per user
- **NFR-5.3:** Support 1,000 profiles per user
- **NFR-5.4:** Database schema supports multi-user without migration

### NFR-6: Maintainability
- **NFR-6.1:** Modular codebase (NestJS modules)
- **NFR-6.2:** API versioning (v1 prefix)
- **NFR-6.3:** Comprehensive error logging
- **NFR-6.4:** Automated testing: unit > 80%, integration > 60%

### NFR-7: Compatibility
- **NFR-7.1:** Web app: Chrome, Firefox, Safari, Edge (last 2 versions)
- **NFR-7.2:** Responsive design: 320px to 2560px width
- **NFR-7.3:** PWA support for mobile-like experience

---

## 8. User Stories

### US-1: Quick Transaction Recording
> As a user, I want to record a cash expense in under 10 seconds so that I don't forget to track it.

**Acceptance Criteria:**
- [ ] Default date is today
- [ ] Amount field auto-focused
- [ ] Category selectable with 2 taps
- [ ] Save button always visible
- [ ] Success confirmation within 1s

### US-2: Business Expense Tracking
> As a business owner, I want to tag expenses to my business so that I can see my business P&L separately.

**Acceptance Criteria:**
- [ ] Business selector visible on transaction form
- [ ] Default business pre-selected if configured
- [ ] Business filter on all reports
- [ ] Business dashboard shows correct P&L

### US-3: Lending Money to Friend
> As a user, I want to record that I lent ₹5,000 to a friend so that I can track repayment.

**Acceptance Criteria:**
- [ ] "Loan Given" transaction type available
- [ ] Profile linked to loan auto-created if new
- [ ] Loan appears in "Loans Given" dashboard widget
- [ ] Repayment reduces outstanding amount
- [ ] Loan status updates automatically

### US-4: Understanding Spending
> As a user, I want to see where my money goes so that I can adjust my spending habits.

**Acceptance Criteria:**
- [ ] Category breakdown chart on dashboard
- [ ] Monthly expense report by category
- [ ] Trend chart shows 6-month history
- [ ] Tap category to see related transactions

### US-5: Offline Recording
> As a user, I want to record transactions without internet so that I can track expenses while traveling.

**Acceptance Criteria:**
- [ ] All forms work offline
- [ ] Data saved to local storage
- [ ] Sync indicator shows pending count
- [ ] Auto-sync when connection restored
- [ ] No data loss on sync

### US-6: Tax Preparation
> As a business owner, I want to export my business income and expenses so that I can file taxes.

**Acceptance Criteria:**
- [ ] Business report filters by date range
- [ ] Export to CSV available
- [ ] Export to PDF available
- [ ] All transaction details included in export

### US-7: Contact Management
> As a user, I want to see all transactions with a specific vendor so that I can track my relationship.

**Acceptance Criteria:**
- [ ] Profile page lists all linked transactions
- [ ] Filter by transaction type on profile page
- [ ] Total amount sent/received per profile
- [ ] Quick call/email from profile page

### US-8: Loan Overdue Alert
> As a lender, I want to know when a loan is overdue so that I can follow up.

**Acceptance Criteria:**
- [ ] Overdue loans highlighted on dashboard
- [ ] Overdue count badge visible
- [ ] Loan list can filter by overdue status
- [ ] Days overdue calculated and displayed

---

## 9. Acceptance Criteria (Global)

### AC-1: Data Integrity
- All monetary values stored as integers (cents) to avoid floating-point errors
- All dates stored in UTC, displayed in local timezone
- Soft deletes only (no hard deletes for transactions, loans, profiles)
- Every transaction must have: amount, type, date, category

### AC-2: UX Standards
- Primary action button: fixed position, high contrast
- Form validation: inline, immediate feedback
- Loading states: skeleton screens preferred over spinners
- Empty states: helpful illustration + CTA to create first item
- Error states: clear message + recovery action

### AC-3: Performance
- Time to Interactive (TTI) < 5s on mobile
- First Contentful Paint (FCP) < 2s
- No layout shift during data loading
- Virtual scrolling for lists > 50 items

### AC-4: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Screen reader labels for all icons
- Color contrast ratio ≥ 4.5:1

---

## 10. Database Entities

### Entity Relationship Overview

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │1──────N│  Business   │1──────N│ Transaction │
│  (future)   │       │             │       │             │
└─────────────┘       └─────────────┘       └──────┬──────┘
                                                  │
┌─────────────┐       ┌─────────────┐            │
│ Attachment  │N──────1│   Profile   │N───────────┘
│             │       │             │
└─────────────┘       └─────────────┘
                             │
                             │1
                             │
                             ▼N
                       ┌─────────────┐
                       │    Loan     │
                       │             │
                       └─────────────┘
```

### Entity Definitions

#### User (Future)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| name | VARCHAR(100) | | Display name |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMP | | Last update |

#### Business
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Business name |
| description | TEXT | | Business description |
| logo_url | VARCHAR(500) | | Logo image URL |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | | Last update |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

#### Profile
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| type | ENUM | NOT NULL | person, business, organization, other |
| name | VARCHAR(100) | NOT NULL | Profile name |
| phone | VARCHAR(20) | | Phone number |
| email | VARCHAR(255) | | Email address |
| address | TEXT | | Physical address |
| description | TEXT | | Brief description |
| notes | TEXT | | Free-form notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | | Last update |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

#### Transaction
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| type | ENUM | NOT NULL | income, expense, loan_given, loan_taken, repayment_received, repayment_made |
| amount | INTEGER | NOT NULL | Amount in cents |
| date | DATE | NOT NULL | Transaction date |
| category | VARCHAR(50) | NOT NULL | Category name |
| description | TEXT | | Transaction description |
| profile_id | UUID | FK → Profile | Linked profile |
| business_id | UUID | FK → Business | Linked business |
| loan_id | UUID | FK → Loan | Linked loan (for repayments) |
| is_reconciled | BOOLEAN | DEFAULT FALSE | Bank reconciliation flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | | Last update |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

#### Loan
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| type | ENUM | NOT NULL | given, taken |
| principal_amount | INTEGER | NOT NULL | Original amount in cents |
| paid_amount | INTEGER | DEFAULT 0 | Total repaid in cents |
| start_date | DATE | NOT NULL | Loan start date |
| due_date | DATE | | Expected repayment date |
| lender_profile_id | UUID | FK → Profile | Who gave the loan |
| borrower_profile_id | UUID | FK → Profile | Who received the loan |
| description | TEXT | | Loan purpose/notes |
| status | ENUM | DEFAULT 'active' | active, paid, overdue |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | | Last update |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

#### Attachment
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| file_name | VARCHAR(255) | NOT NULL | Original filename |
| file_path | VARCHAR(500) | NOT NULL | Storage path |
| file_type | VARCHAR(50) | NOT NULL | MIME type |
| file_size | INTEGER | NOT NULL | Size in bytes |
| entity_type | ENUM | NOT NULL | transaction, profile, loan, business |
| entity_id | UUID | NOT NULL | Linked entity ID |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload date |

---

## 11. High-Level Database Schema

```sql
-- ============================================
-- CORE TABLES
-- ============================================

-- Users (Future Phase)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Businesses
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

-- Profiles (Contacts)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('person', 'business', 'organization', 'other')),
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

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL CHECK (type IN ('income', 'expense', 'loan_given', 'loan_taken', 'repayment_received', 'repayment_made')),
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

-- Loans
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(10) NOT NULL CHECK (type IN ('given', 'taken')),
    principal_amount INTEGER NOT NULL CHECK (principal_amount > 0),
    paid_amount INTEGER DEFAULT 0 CHECK (paid_amount >= 0),
    start_date DATE NOT NULL,
    due_date DATE,
    lender_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    borrower_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'paid', 'overdue')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('transaction', 'profile', 'loan', 'business')),
    entity_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_profile ON transactions(profile_id);
CREATE INDEX idx_transactions_business ON transactions(business_id);
CREATE INDEX idx_transactions_loan ON transactions(loan_id);
CREATE INDEX idx_transactions_deleted ON transactions(deleted_at);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);
CREATE INDEX idx_profiles_name ON profiles(name);
CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);

-- ============================================
-- VIEWS
-- ============================================

-- Dashboard Summary View
CREATE VIEW v_dashboard_summary AS
SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as net_balance
FROM transactions
WHERE deleted_at IS NULL;

-- Loan Summary View
CREATE VIEW v_loan_summary AS
SELECT 
    type,
    COUNT(*) as loan_count,
    SUM(principal_amount) as total_principal,
    SUM(paid_amount) as total_paid,
    SUM(principal_amount - paid_amount) as total_outstanding
FROM loans
WHERE deleted_at IS NULL AND status != 'paid'
GROUP BY type;
```

---

## 12. API Module Structure

```
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── database.config.ts
│   ├── app.config.ts
│   └── storage.config.ts
├── common/
│   ├── filters/
│   ├── interceptors/
│   ├── pipes/
│   ├── decorators/
│   └── guards/
├── modules/
│   ├── auth/              # Future: authentication
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── users/             # Future: user management
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   ├── businesses/
│   │   ├── businesses.module.ts
│   │   ├── businesses.controller.ts
│   │   ├── businesses.service.ts
│   │   ├── businesses.repository.ts
│   │   └── dto/
│   ├── profiles/
│   │   ├── profiles.module.ts
│   │   ├── profiles.controller.ts
│   │   ├── profiles.service.ts
│   │   ├── profiles.repository.ts
│   │   └── dto/
│   ├── transactions/
│   │   ├── transactions.module.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.repository.ts
│   │   └── dto/
│   ├── loans/
│   │   ├── loans.module.ts
│   │   ├── loans.controller.ts
│   │   ├── loans.service.ts
│   │   ├── loans.repository.ts
│   │   └── dto/
│   ├── attachments/
│   │   ├── attachments.module.ts
│   │   ├── attachments.controller.ts
│   │   ├── attachments.service.ts
│   │   └── dto/
│   ├── reports/
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── dto/
│   └── dashboard/
│       ├── dashboard.module.ts
│       ├── dashboard.controller.ts
│       ├── dashboard.service.ts
│       └── dto/
├── database/
│   ├── migrations/
│   └── seeds/
└── shared/
    ├── types/
    ├── utils/
    └── constants/
```

### API Endpoints Overview

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| **Businesses** | `/api/v1/businesses` | GET | List all businesses |
| | `/api/v1/businesses` | POST | Create business |
| | `/api/v1/businesses/:id` | GET | Get business by ID |
| | `/api/v1/businesses/:id` | PATCH | Update business |
| | `/api/v1/businesses/:id` | DELETE | Soft delete business |
| | `/api/v1/businesses/:id/summary` | GET | Business dashboard data |
| **Profiles** | `/api/v1/profiles` | GET | List profiles (searchable) |
| | `/api/v1/profiles` | POST | Create profile |
| | `/api/v1/profiles/:id` | GET | Get profile with transactions |
| | `/api/v1/profiles/:id` | PATCH | Update profile |
| | `/api/v1/profiles/:id` | DELETE | Soft delete profile |
| **Transactions** | `/api/v1/transactions` | GET | List transactions (filterable) |
| | `/api/v1/transactions` | POST | Create transaction |
| | `/api/v1/transactions/:id` | GET | Get transaction |
| | `/api/v1/transactions/:id` | PATCH | Update transaction |
| | `/api/v1/transactions/:id` | DELETE | Soft delete transaction |
| | `/api/v1/transactions/recent` | GET | Recent transactions |
| **Loans** | `/api/v1/loans` | GET | List loans (filterable) |
| | `/api/v1/loans` | POST | Create loan |
| | `/api/v1/loans/:id` | GET | Get loan with repayments |
| | `/api/v1/loans/:id` | PATCH | Update loan |
| | `/api/v1/loans/:id/repayments` | POST | Record repayment |
| | `/api/v1/loans/:id` | DELETE | Soft delete loan |
| **Attachments** | `/api/v1/attachments` | POST | Upload file |
| | `/api/v1/attachments/:id` | GET | Download file |
| | `/api/v1/attachments/:id` | DELETE | Delete file |
| **Reports** | `/api/v1/reports/income` | GET | Income report |
| | `/api/v1/reports/expense` | GET | Expense report |
| | `/api/v1/reports/profit-loss` | GET | P&L report |
| | `/api/v1/reports/loans` | GET | Loan report |
| | `/api/v1/reports/business/:id` | GET | Business report |
| | `/api/v1/reports/profile/:id` | GET | Profile activity report |
| | `/api/v1/reports/export` | GET | Export report (PDF/CSV) |
| **Dashboard** | `/api/v1/dashboard` | GET | Dashboard metrics |
| | `/api/v1/dashboard/trends` | GET | Income/expense trends |
| | `/api/v1/dashboard/categories` | GET | Category breakdown |

---

## 13. Screen List

### Web App Screens (MVP)

| # | Screen | Route | Priority |
|---|--------|-------|----------|
| 1 | **Dashboard** | `/dashboard` | P0 |
| 2 | **Transaction List** | `/transactions` | P0 |
| 3 | **Transaction Detail** | `/transactions/:id` | P0 |
| 4 | **Add Transaction** | `/transactions/new` | P0 |
| 5 | **Edit Transaction** | `/transactions/:id/edit` | P0 |
| 6 | **Profile List** | `/profiles` | P0 |
| 7 | **Profile Detail** | `/profiles/:id` | P0 |
| 8 | **Add/Edit Profile** | `/profiles/new`, `/profiles/:id/edit` | P0 |
| 9 | **Business List** | `/businesses` | P1 |
| 10 | **Business Detail** | `/businesses/:id` | P1 |
| 11 | **Add/Edit Business** | `/businesses/new`, `/businesses/:id/edit` | P1 |
| 12 | **Loan List** | `/loans` | P1 |
| 13 | **Loan Detail** | `/loans/:id` | P1 |
| 14 | **Add/Edit Loan** | `/loans/new`, `/loans/:id/edit` | P1 |
| 15 | **Reports Hub** | `/reports` | P1 |
| 16 | **Report View** | `/reports/:type` | P1 |
| 17 | **Settings** | `/settings` | P2 |
| 18 | **Data Export** | `/settings/export` | P2 |
| 19 | **Sync Status** | `/settings/sync` | P2 |

### Mobile App Screens (Future)
- All web screens adapted for mobile
- Quick-add widget (home screen)
- Camera capture for receipt attachments
- Biometric authentication
- Push notifications for overdue loans

---

## 14. UX Flow

### Primary Flow: Record a Transaction

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Open App  │────▶│  Dashboard  │────▶│  Tap "+"    │
│             │     │             │     │   Button    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ Transaction │
                                       │    Form     │
                                       └──────┬──────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
             ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
             │   Enter     │         │  Select     │         │  (Optional)  │
             │   Amount    │         │  Category   │         │ Add Profile  │
             │   & Type    │         │             │         │  (inline)    │
             └─────────────┘         └─────────────┘         └─────────────┘
                    │                         │                         │
                    └─────────────────────────┴─────────────────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │  Tap Save   │
                                       │  (< 2 sec)  │
                                       └──────┬──────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │  Success    │
                                       │  Return to  │
                                       │  Dashboard  │
                                       └─────────────┘
```

### Secondary Flow: Record a Loan

```
Dashboard ──▶ Tap "Loans" ──▶ Tap "New Loan" ──▶ Select Loan Type
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    │                               │                               │
                    ▼                               ▼                               ▼
             Enter Principal                  Select Profile                   Set Due Date
             & Description                    (or create new)                  (optional)
                    │                               │                               │
                    └───────────────────────────────┴───────────────────────────────┘
                                                    │
                                                    ▼
                                             Save Loan
                                                    │
                                                    ▼
                                             Auto-create
                                             Transaction
                                             (Loan Given/Taken)
```

### Tertiary Flow: Record a Repayment

```
Loan Detail ──▶ Tap "Record Repayment" ──▶ Enter Amount
                                                    │
                                                    ▼
                                             Select Date
                                                    │
                                                    ▼
                                             Save Repayment
                                                    │
                                                    ▼
                                             Auto-update:
                                             • Loan paid_amount
                                             • Loan status
                                             • Create repayment transaction
```

---

## 15. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  💰 Finance Manager                              [Sync: ✅]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Current Balance:            ₹ 1,24,500             │   │
│  │  [This Month]  [Last Month]  [Custom Range]            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Income   │  │ Expense  │  │  P/L     │  │  Loans   │  │
│  │ ₹85,000  │  │ ₹42,500  │  │ +₹42,500│  │  ₹15,000│  │
│  │ ↑ 12%    │  │ ↓ 5%     │  │ ↑ 8%    │  │ 2 active │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │   INCOME TREND          │  │   EXPENSE TREND         │  │
│  │   [Line Chart]          │  │   [Line Chart]          │  │
│  │                         │  │                         │  │
│  │   Jan  Feb  Mar  Apr   │  │   Jan  Feb  Mar  Apr   │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │   CATEGORY BREAKDOWN    │  │   RECENT TRANSACTIONS   │  │
│  │   [Donut Chart]         │  │   ┌───────────────────┐ │  │
│  │                         │  │   │ ₹500  Lunch      │ │  │
│  │   Food     35%          │  │   │ ₹2000 Rent       │ │  │
│  │   Rent     25%          │  │   │ ₹15000 Client A  │ │  │
│  │   Travel   15%          │  │   │ ...              │ │  │
│  │   Others   25%          │  │   └───────────────────┘ │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ OVERDUE LOANS: 2  │  View All →                   │   │
│  │  • Rajesh: ₹5,000 (15 days overdue)                  │   │
│  │  • Client B: ₹12,000 (5 days overdue)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [🏠]    [💰]    [➕]    [📊]    [👤]                      │
│  Home   Trans.   Add    Reports  Profile                   │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Component Breakdown

| Component | Data Source | Update Frequency |
|-----------|-------------|------------------|
| Balance Card | SUM transactions | Real-time (local) |
| Metric Cards | Aggregated queries | Real-time (local) |
| Income Trend | Monthly income GROUP BY | On date range change |
| Expense Trend | Monthly expense GROUP BY | On date range change |
| Category Breakdown | Category SUM GROUP BY | On date range change |
| Recent Transactions | LIMIT 10 ORDER BY date | Real-time (local) |
| Overdue Loans | loans WHERE status='overdue' | Real-time (local) |

---

## 16. Navigation Structure

### Web App Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                      TOP NAVIGATION                          │
│  [Logo]  Dashboard  Transactions  Profiles  Businesses     │
│  Loans  Reports  [Search]  [Settings ⚙️]  [Add +]           │
└─────────────────────────────────────────────────────────────┘

Mobile (Bottom Navigation):
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                          [Content Area]                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [🏠]      [💰]      [➕]      [📊]      [⚙️]              │
│  Home     Trans.    Add      Reports   More                 │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Hierarchy

```
Home (Dashboard)
│
├── Transactions
│   ├── List View
│   ├── Detail View
│   ├── Add/Edit Form
│   └── Filters
│
├── Profiles
│   ├── List View
│   ├── Detail View (with transactions)
│   └── Add/Edit Form
│
├── Businesses
│   ├── List View
│   ├── Detail View (dashboard)
│   └── Add/Edit Form
│
├── Loans
│   ├── List View
│   ├── Detail View (with repayments)
│   ├── Add/Edit Form
│   └── Record Repayment
│
├── Reports
│   ├── Report Hub
│   ├── Individual Reports
│   └── Export Options
│
└── Settings (More)
    ├── Data Export
    ├── Categories (manage)
    ├── Sync Status
    ├── Backup & Restore
    └── About
```

---

## 17. Future Roadmap

### Phase 1: Foundation (MVP) — Months 1-3
- [ ] Core transaction CRUD
- [ ] Dashboard with charts
- [ ] Profile & business management
- [ ] Loan tracking (basic)
- [ ] Offline-first architecture
- [ ] Web app (responsive)
- [ ] Local data storage (IndexedDB)

### Phase 2: Enhancement (V2) — Months 4-6
- [ ] File attachments
- [ ] Full reporting suite with export
- [ ] PWA support
- [ ] Keyboard shortcuts
- [ ] Data import (CSV)
- [ ] Advanced filters
- [ ] Dark mode
- [ ] Multi-language support

### Phase 3: Multi-User (V3) — Months 7-9
- [ ] User authentication
- [ ] Cloud sync
- [ ] Multi-user accounts
- [ ] Family sharing (read-only / editor roles)
- [ ] Mobile app (React Native / Flutter)
- [ ] Push notifications
- [ ] Biometric auth

### Phase 4: Integration (V4) — Months 10-12
- [ ] Bank API integration (Plaid / open banking)
- [ ] Automatic transaction import
- [ ] Recurring transactions
- [ ] Budgeting features
- [ ] AI-powered insights
- [ ] QuickBooks / Xero export
- [ ] Advanced analytics

### Phase 5: Scale (V5+) — Year 2
- [ ] Team collaboration
- [ ] Advanced permissions
- [ ] API for third-party integrations
- [ ] White-label option
- [ ] Marketplace for add-ons

---

## 18. Development Phases

### MVP (Month 1-3) — "Record & See"

**Goal:** A functional offline-first web app for personal finance tracking.

**Sprint Breakdown:**

| Sprint | Duration | Focus | Deliverables |
|--------|----------|-------|--------------|
| **Sprint 1** | Week 1-2 | Project Setup & DB | NestJS project, PostgreSQL schema, migrations, local storage layer |
| **Sprint 2** | Week 3-4 | Transactions Module | Transaction CRUD API, basic web UI, offline storage |
| **Sprint 3** | Week 5-6 | Dashboard | Dashboard API, charts, metrics calculation |
| **Sprint 4** | Week 7-8 | Profiles & Businesses | Profile CRUD, business CRUD, inline creation |
| **Sprint 5** | Week 9-10 | Loans Module | Loan CRUD, repayment tracking, status logic |
| **Sprint 6** | Week 11-12 | Polish & Reports | Basic reports, UI polish, bug fixes, performance testing |

**MVP Tech Stack:**
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React / Vue + TypeScript + Chart.js
- Local Storage: IndexedDB (Dexie.js)
- Styling: Tailwind CSS
- Build: Vite

**MVP Success Criteria:**
- Record transaction in < 10 seconds
- Dashboard loads in < 3 seconds
- Works completely offline
- All core features functional

---

### V2 (Month 4-6) — "Organize & Export"

**New Features:**
- File attachments (receipts, invoices)
- Full reporting suite (6 reports + export)
- PWA with offline support
- Data import (CSV)
- Keyboard shortcuts
- Dark mode
- Category management
- Transaction templates

**Technical Focus:**
- File storage service (S3-compatible)
- PDF generation service
- CSV parser
- Service worker for PWA
- Theme system

---

### V3 (Month 7-9) — "Sync & Share"

**New Features:**
- User accounts & authentication (JWT)
- Cloud sync (backend API)
- Multi-device support
- Family sharing (up to 5 members)
- Role-based access (viewer, editor, admin)
- Mobile app (React Native)
- Push notifications
- Biometric authentication

**Technical Focus:**
- Auth module (NestJS Passport + JWT)
- Sync engine (conflict resolution)
- Mobile app architecture
- Push notification service (Firebase)
- Security hardening

---

### V3+ (Month 10-12+) — "Integrate & Scale"

**New Features:**
- Bank integration (read-only import)
- Recurring transactions
- Budgeting
- AI insights
- Advanced analytics
- Third-party integrations

---

## Appendix A: Category Suggestions (Default)

### Income Categories
- Salary
- Freelance
- Business Income
- Investment
- Gift
- Refund
- Other Income

### Expense Categories
- Food & Dining
- Rent / Housing
- Transportation
- Utilities
- Healthcare
- Entertainment
- Shopping
- Education
- Travel
- Personal Care
- Insurance
- Taxes
- Business Expense
- Loan Repayment
- Other Expense

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Offline-first** | Application designed to work without internet, syncing when available |
| **Soft Delete** | Marking records as deleted without removing them (retains reporting integrity) |
| **PWA** | Progressive Web App — web app with native-like features |
| **CRUD** | Create, Read, Update, Delete — basic data operations |
| **P&L** | Profit & Loss — financial statement showing income vs expenses |
| **TTI** | Time to Interactive — metric for app responsiveness |

---

## Appendix C: Risk & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Offline sync conflicts | High | Medium | Last-write-wins + manual conflict resolution UI |
| Data loss during sync | High | Low | Local backups, retry logic, transaction logs |
| Scope creep | Medium | High | Strict MVP definition, weekly scope reviews |
| Performance with large datasets | Medium | Medium | Pagination, virtual scrolling, database indexing |
| Mobile app complexity | Medium | Medium | PWA first, native app later |
| Security vulnerabilities | High | Medium | OWASP compliance, regular audits, input validation |

---

*Document Version: 1.0*  
*Last Updated: 2026-06-23*  
*Next Review: After MVP completion*
