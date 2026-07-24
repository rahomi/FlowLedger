import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile, Business, Transaction, Loan } from '@finance-manager/db';
import { TransactionType, LoanStatus } from '@finance-manager/types';
import { Between, LessThan, MoreThan } from 'typeorm';

describe('DashboardService', () => {
  let service: DashboardService;
  let profileRepository;
  let businessRepository;
  let transactionRepository;
  let loanRepository;

  const mockProfileRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockBusinessRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockTransactionRepository = {
    find: jest.fn(),
    sum: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockLoanRepository = {
    find: jest.fn(),
    count: jest.fn(),
    sum: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockProfile = {
    id: 'profile-1',
    userId: 'user-1',
    type: 'personal',
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    address: '123 Main St',
    description: 'Personal profile',
    notes: 'Test profile',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockBusiness = {
    id: 'business-1',
    profileId: 'profile-1',
    type: 'business',
    name: 'Acme Corp',
    phone: '9876543210',
    email: 'contact@acme.com',
    address: '456 Business Ave',
    description: 'Technology company',
    notes: 'Test business',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockTransactions = [
    {
      id: 'txn-1',
      profileId: 'profile-1',
      amount: 50000,
      type: TransactionType.Income,
      category: 'Salary',
      date: new Date('2024-01-15'),
      description: 'Monthly salary',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      profile: mockProfile,
      business: null,
    },
    {
      id: 'txn-2',
      profileId: 'profile-1',
      amount: -20000,
      type: TransactionType.Expense,
      category: 'Rent',
      date: new Date('2024-01-20'),
      description: 'Monthly rent',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      profile: mockProfile,
      business: null,
    },
    {
      id: 'txn-3',
      businessId: 'business-1',
      amount: 100000,
      type: TransactionType.Income,
      category: 'Sales',
      date: new Date('2024-01-10'),
      description: 'Product sales',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      profile: null,
      business: mockBusiness,
    },
  ];

  const mockLoans = [
    {
      id: 'loan-1',
      profileId: 'profile-1',
      amount: 1000000,
      interestRate: 500,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      type: 'taken',
      status: LoanStatus.Active,
      monthlyPayment: 85607,
      remainingBalance: 85607,
      dueDate: new Date('2024-02-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      lenderProfile: mockProfile,
      borrowerProfile: mockProfile,
    },
    {
      id: 'loan-2',
      profileId: 'profile-1',
      amount: 500000,
      interestRate: 300,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-12-01'),
      type: 'taken',
      status: LoanStatus.Overdue,
      monthlyPayment: 85714,
      remainingBalance: 514286,
      dueDate: new Date('2023-12-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      lenderProfile: mockProfile,
      borrowerProfile: mockProfile,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(Business),
          useValue: mockBusinessRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Loan),
          useValue: mockLoanRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    profileRepository = module.get(getRepositoryToken(Profile));
    businessRepository = module.get(getRepositoryToken(Business));
    transactionRepository = module.get(getRepositoryToken(Transaction));
    loanRepository = module.get(getRepositoryToken(Loan));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should return dashboard overview with financial metrics', async () => {
      const dateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };

      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockBusinessRepository.count.mockResolvedValue(1);
      mockTransactionRepository.sum.mockImplementation((field, where) => {
        if (where.type === TransactionType.Income) return Promise.resolve(150000); // 50000 + 100000
        if (where.type === TransactionType.Expense) return Promise.resolve(-20000);
        return Promise.resolve(0);
      });
      mockTransactionRepository.find.mockResolvedValue([
        mockTransactions[0],
        mockTransactions[1],
        mockTransactions[2],
      ]);
      mockLoanRepository.count.mockImplementation((options: any) => {
        const where = options.where;
        if (where.type === 'given') return Promise.resolve(0);
        if (where.type === 'taken') return Promise.resolve(2);
        return Promise.resolve(0);
      });
      mockLoanRepository.find.mockResolvedValue([mockLoans[1]]); // Overdue loans

      const result = await service.getOverview('user-1', dateRange);

      expect(result).toBeDefined();
      expect(result.financialMetrics).toBeDefined();
      expect(result.loanMetrics).toBeDefined();
      expect(result.businessMetrics).toBeDefined();
      expect(result.recentTransactions).toBeDefined();
      expect(result.overdueLoans).toBeDefined();

      expect(result.financialMetrics.totalIncome).toBe(150000);
      expect(result.financialMetrics.totalExpense).toBe(-20000);
      expect(result.financialMetrics.netBalance).toBe(170000);
      expect(result.loanMetrics.loansGiven).toBe(0);
      expect(result.loanMetrics.loansTaken).toBe(2); // Both loans are 'taken' type
      expect(result.loanMetrics.overdueLoans).toBe(1);
      expect(result.businessMetrics.totalBusinesses).toBe(1);
      expect(result.recentTransactions).toHaveLength(3);
      expect(result.overdueLoans).toHaveLength(1);
    });

    it('should handle missing date range', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockBusinessRepository.count.mockResolvedValue(0);
      mockTransactionRepository.sum.mockResolvedValue(0);
      mockTransactionRepository.find.mockResolvedValue([]);
      mockLoanRepository.count.mockResolvedValue(0);
      mockLoanRepository.find.mockResolvedValue([]);

      const result = await service.getOverview('user-1');

      expect(result).toBeDefined();
      expect(result.financialMetrics.totalIncome).toBe(0);
      expect(result.financialMetrics.totalExpense).toBe(0);
    });
  });

  describe('getIncomeExpenseTrends', () => {
    it('should return income and expense trends for specified months', async () => {
      const months = 6;

      mockTransactionRepository.find.mockResolvedValue([
        mockTransactions[0],
        mockTransactions[1],
        mockTransactions[2],
      ]);

      const result = await service.getIncomeExpenseTrends('user-1', months);

      expect(result).toBeDefined();
      expect(result.trends).toBeDefined();
      expect(result.trends).toHaveLength(1); // One month in mock data

      const trend = result.trends[0];
      expect(trend.income).toBe(150000); // 50000 + 100000
      expect(trend.expense).toBe(-20000);
    });

    it('should handle empty transactions', async () => {
      mockTransactionRepository.find.mockResolvedValue([]);

      const result = await service.getIncomeExpenseTrends('user-1', 6);

      expect(result.trends).toHaveLength(0);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should return category breakdown for income and expenses', async () => {
      const dateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };

      mockTransactionRepository.find.mockResolvedValue([
        mockTransactions[0],
        mockTransactions[1],
        mockTransactions[2],
      ]);

      const result = await service.getCategoryBreakdown('user-1', dateRange);

      expect(result).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.categories).toHaveLength(3); // Salary, Rent, Sales

      const salaryCategory = result.categories.find((c: any) => c.category === 'Salary');
      expect(salaryCategory).toBeDefined();
      expect(salaryCategory.amount).toBe(50000);
      expect(salaryCategory.type).toBe(TransactionType.Income);
    });

    it('should filter transactions by date range', async () => {
      const dateRange = { startDate: '2024-01-10', endDate: '2024-01-22' };

      mockTransactionRepository.find.mockResolvedValue([
        mockTransactions[0], // Jan 15 - within range
        mockTransactions[1], // Jan 20 - within range
      ]);

      const result = await service.getCategoryBreakdown('user-1', dateRange);

      expect(result.categories).toHaveLength(2); // Salary and Rent
    });
  });

  describe('getFinancialHealth', () => {
    it('should calculate financial health metrics', async () => {
      mockTransactionRepository.sum.mockImplementation((field, where) => {
        if (where.type === TransactionType.Income) return Promise.resolve(150000);
        if (where.type === TransactionType.Expense) return Promise.resolve(-50000);
        return Promise.resolve(0);
      });
      mockLoanRepository.sum.mockImplementation((field, where) => {
        if (where.type === 'taken') return Promise.resolve(1500000); // 1000000 + 500000
        if (where.type === 'given') return Promise.resolve(0);
        return Promise.resolve(0);
      });

      const result = await service.getFinancialHealth('user-1');

      expect(result).toBeDefined();
      expect(result.financialMetrics).toBeDefined();
      expect(result.financialHealthScore).toBeDefined();
      expect(result.recommendations).toBeDefined();

      expect(result.financialMetrics.totalIncome).toBe(150000);
      expect(result.financialMetrics.totalExpense).toBe(-50000);
      expect(result.financialMetrics.netIncome).toBe(200000);
      expect(result.financialMetrics.totalDebt).toBe(1500000);
      expect(result.financialMetrics.debtToIncomeRatio).toBe(7.5); // 1500000 / 200000
      expect(result.financialHealthScore).toBeGreaterThanOrEqual(0);
      expect(result.financialHealthScore).toBeLessThanOrEqual(100);
    });

    it('should handle no debt scenario', async () => {
      mockTransactionRepository.sum.mockImplementation((field, where) => {
        if (where.type === TransactionType.Income) return Promise.resolve(100000);
        if (where.type === TransactionType.Expense) return Promise.resolve(-30000);
        return Promise.resolve(0);
      });
      mockLoanRepository.sum.mockResolvedValue(0);

      const result = await service.getFinancialHealth('user-1');

      expect(result.financialMetrics.debtToIncomeRatio).toBe(0);
      expect(result.financialHealthScore).toBeGreaterThan(50);
    });
  });

  describe('getAlerts', () => {
    it('should return alerts for overdue loans and unusual spending', async () => {
      const today = new Date();

      mockLoanRepository.find.mockImplementation((options) => {
        if (options.where.status === LoanStatus.Overdue) {
          return Promise.resolve([mockLoans[1]]); // Overdue loan
        }
        if (options.where.status === LoanStatus.Active) {
          return Promise.resolve([mockLoans[0]]); // Upcoming loan
        }
        return Promise.resolve([]);
      });
      mockTransactionRepository.find.mockResolvedValue([
        mockTransactions[0], // Large transaction
      ]);

      const result = await service.getAlerts('user-1');

      expect(result).toBeDefined();
      expect(result.alerts).toBeDefined();
      expect(result.notificationCount).toBeDefined();

      expect(result.alerts).toHaveLength(3); // 1 overdue, 1 upcoming, 1 large transaction
      expect(result.notificationCount).toBe(3);

      const overdueAlert = result.alerts.find((a: any) => a.type === 'loan_overdue');
      expect(overdueAlert).toBeDefined();
      expect(overdueAlert.severity).toBe('high');

      const upcomingAlert = result.alerts.find((a: any) => a.type === 'loan_due_soon');
      expect(upcomingAlert).toBeDefined();
      expect(upcomingAlert.severity).toBe('medium');

      const largeTxAlert = result.alerts.find((a: any) => a.type === 'large_transaction');
      expect(largeTxAlert).toBeDefined();
      expect(largeTxAlert.severity).toBe('low');
    });

    it('should return empty alerts when no issues found', async () => {
      mockLoanRepository.find.mockResolvedValue([]);
      mockTransactionRepository.find.mockResolvedValue([]);

      const result = await service.getAlerts('user-1');

      expect(result.alerts).toHaveLength(0);
      expect(result.notificationCount).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      mockProfileRepository.findOne.mockRejectedValue(new Error('Database error'));

      // The service should handle errors gracefully and return default values
      const result = await service.getOverview('user-1', { startDate: '2024-01-01', endDate: '2024-01-31' });

      expect(result).toBeDefined();
      expect(result.financialMetrics).toBeDefined();
      expect(result.loanMetrics).toBeDefined();
      expect(result.businessMetrics).toBeDefined();
    });

    it('should handle invalid date ranges', async () => {
      const dateRange = { startDate: '2024-01-31', endDate: '2024-01-01' };

      // Mock empty results for invalid date range
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockBusinessRepository.count.mockResolvedValue(0);
      mockTransactionRepository.sum.mockResolvedValue(0);
      mockTransactionRepository.find.mockResolvedValue([]);
      mockLoanRepository.count.mockResolvedValue(0);
      mockLoanRepository.find.mockResolvedValue([]);

      const result = await service.getOverview('user-1', dateRange);

      expect(result.financialMetrics.totalIncome).toBe(0);
      expect(result.financialMetrics.totalExpense).toBe(0);
    });
  });
});