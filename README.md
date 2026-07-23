# FlowLedger - Offline-First Finance Manager

![FlowLedger Logo](https://raw.githubusercontent.com/rahomi/FlowLedger/master/apps/web/public/logo.svg)  

**Offline-first personal and small-business finance manager with NestJS backend and React frontend.**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/rahomi/FlowLedger.git
cd FlowLedger

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the development server
npm run start:api
```

## 📂 Project Structure

```
flowledger/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend (coming soon)
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── dto/          # Data Transfer Objects
│   ├── db/           # Database entities
│   └── utils/        # Utility functions
├── .gitignore
├── README.md
└── package.json
```

## 🔧 Backend Modules

### Core Modules
- **Businesses** - Business financial management
- **Personal** - Personal account management  
- **Profiles** - User profile management
- **Transactions** - Financial transaction tracking
- **Loans** - Loan management with amortization
- **Attachments** - Document/file management
- **Reports** - Financial reporting system
- **Dashboard** - Overview and analytics

### API Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Businesses | `/api/v1/businesses` | Business CRUD operations |
| Personal | `/api/v1/personal-accounts` | Personal account management |
| Profiles | `/api/v1/profiles` | User profile management |
| Transactions | `/api/v1/transactions` | Transaction management |
| Loans | `/api/v1/loans` | Loan management |
| Attachments | `/api/v1/attachments` | File attachments |
| Reports | `/api/v1/reports/*` | Financial reports |
| Dashboard | `/api/v1/dashboard/*` | Overview data |

## 🛠️ Technical Stack

### Backend
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (coming soon)
- **Validation**: class-validator
- **API**: RESTful with versioning

### Frontend (Planned)
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Offline**: IndexedDB with PWA support
- **Charts**: Chart.js

### Shared
- **Language**: TypeScript 5.x
- **Monorepo**: npm workspaces
- **Linting**: ESLint + Prettier
- **Testing**: Jest

## 🔐 Key Features

### Offline-First Design
- All data operations work offline
- Automatic sync when connection restored
- Conflict resolution strategies

### Financial Precision
- **Integer cents** for all monetary values
- No floating-point arithmetic
- Multi-currency support

### Data Safety
- **Soft deletion** for all records
- **Idempotent sync** operations
- **Transaction logging**

### Security
- **Strict separation** between personal and business finances
- **Role-based access** control
- **Data encryption** at rest

## 📖 Architecture Principles

1. **Offline-First**: Never lose locally created data
2. **Precision**: Use integer minor units for money
3. **Safety**: Soft deletion and idempotent operations
4. **Separation**: Clear personal vs business finance boundaries
5. **Simplicity**: Prefer maintainable code over abstraction

## 🎯 Development Workflow

```bash
# Install dependencies
npm install

# Run backend in development
npm run start:api

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or support, please open an issue on GitHub.

---

**FlowLedger** - Your offline-first financial companion 💰