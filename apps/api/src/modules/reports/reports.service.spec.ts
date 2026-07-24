import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '@finance-manager/db';
import { Loan } from '@finance-manager/db';
import { Business } from '@finance-manager/db';
import { Profile } from '@finance-manager/db';
import { TransactionType } from '@finance-manager/types';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockProfile = { id: '1', name: 'Test Profile' };
  const mockBusiness = { id: '1', name: 'Test Business' };

  const mockTransactionRepository = {
    find: jest.fn().mockImplementation(({ where }) => {
      // Mock data for testing
      const mockTransactions = [
        { id: 1, amount: 10000, type: TransactionType.Income, date: new Date('2023-01-15'), accountType: 'personal', category: 'Salary', profile: mockProfile },
        { id: 2, amount: 5000, type: TransactionType.Expense, date: new Date('2023-01-20'), accountType: 'personal', category: 'Food', profile: mockProfile },
        { id: 3, amount: 20000, type: TransactionType.Income, date: new Date('2023-02-01'), accountType: 'business', category: 'Sales', business: mockBusiness },
        { id: 4, amount: 8000, type: TransactionType.Expense, date: new Date('2023-02-10'), accountType: 'business', category: 'Supplies', business: mockBusiness },
        { id: 5, amount: 2000, type: TransactionType.Expense, date: new Date('2023-01-05'), accountType: 'personal', category: 'Education', profile: mockProfile },
        { id: 6, amount: 1000, type: TransactionType.Expense, date: new Date('2023-01-10'), accountType: 'personal', category: 'Tax Payment', profile: mockProfile },
      ];

      let filtered = mockTransactions;

      if (where.accountType) {
        filtered = filtered.filter(t => t.accountType === where.accountType);
      }

      if (where.type) {
        filtered = filtered.filter(t => t.type === where.type);
      }

      // Handle Between operator - check for TypeORM Between structure
      if (where.date && where.date.Between) {
        const [startDate, endDate] = where.date.Between;
        filtered = filtered.filter(t => t.date >= startDate && t.date <= endDate);
      } else if (where.date && where.date[0] && where.date[1]) {
        // Handle array format
        filtered = filtered.filter(t => t.date >= where.date[0] && t.date <= where.date[1]);
      } else if (where.date && where.date._type === 'between') {
        // Handle TypeORM Between operator with _type
        const [startDate, endDate] = where.date._value;
        filtered = filtered.filter(t => t.date >= new Date(startDate) && t.date <= new Date(endDate));
      } else if (where.date && where.date._type === 'lessThan') {
        // Handle LessThan operator
        const endDate = new Date(where.date._value);
        filtered = filtered.filter(t => t.date < endDate);
      }

      if (where.category) {
        if (Array.isArray(where.category)) {
          // Handle In operator
          filtered = filtered.filter(t => where.category.includes(t.category));
        } else if (where.category._type === 'in') {
          // Handle TypeORM In operator
          const categories = where.category._value;
          filtered = filtered.filter(t => categories.includes(t.category));
        } else {
          filtered = filtered.filter(t => t.category === where.category);
        }
      }

      // Filter by profile
      if (where.profile && where.profile.id) {
        filtered = filtered.filter(t => t.profile?.id === where.profile.id);
      }

      // Filter by business
      if (where.business && where.business.id) {
        filtered = filtered.filter(t => t.business?.id === where.business.id);
      }

      return filtered;
    }),
    sum: jest.fn().mockImplementation((field, where) => {
      console.log('=== SUM called with field:', field, '===');
      console.log('SUM where conditions:', JSON.stringify(where, null, 2));
      const mockTransactions = [
        { id: 1, amount: 10000, type: TransactionType.Income, date: new Date('2023-01-15'), accountType: 'personal', category: 'Salary', profile: mockProfile },
        { id: 2, amount: 5000, type: TransactionType.Expense, date: new Date('2023-01-20'), accountType: 'personal', category: 'Food', profile: mockProfile },
        { id: 3, amount: 20000, type: TransactionType.Income, date: new Date('2023-02-01'), accountType: 'business', category: 'Sales', business: mockBusiness },
        { id: 4, amount: 8000, type: TransactionType.Expense, date: new Date('2023-02-10'), accountType: 'business', category: 'Supplies', business: mockBusiness },
        { id: 5, amount: 2000, type: TransactionType.Expense, date: new Date('2023-01-05'), accountType: 'personal', category: 'Education', profile: mockProfile },
        { id: 6, amount: 1000, type: TransactionType.Expense, date: new Date('2023-01-10'), accountType: 'personal', category: 'Tax Payment', profile: mockProfile },
      ];

      let filtered = mockTransactions;

      if (where.accountType) {
        filtered = filtered.filter(t => t.accountType === where.accountType);
      }

      if (where.type) {
        filtered = filtered.filter(t => t.type === where.type);
      }

      // Handle Between operator - check for TypeORM Between structure
      if (where.date && where.date.Between) {
        const [startDate, endDate] = where.date.Between;
        filtered = filtered.filter(t => t.date >= startDate && t.date <= endDate);
      } else if (where.date && where.date[0] && where.date[1]) {
        // Handle array format
        filtered = filtered.filter(t => t.date >= where.date[0] && t.date <= where.date[1]);
      } else if (where.date && where.date._type === 'between') {
        // Handle TypeORM Between operator with _type
        const [startDate, endDate] = where.date._value;
        filtered = filtered.filter(t => t.date >= new Date(startDate) && t.date <= new Date(endDate));
      } else if (where.date && where.date._type === 'lessThan') {
        // Handle LessThan operator
        const endDate = new Date(where.date._value);
        filtered = filtered.filter(t => t.date < endDate);
      }

      if (where.category) {
        if (Array.isArray(where.category)) {
          // Handle In operator
          filtered = filtered.filter(t => where.category.includes(t.category));
        } else if (where.category._type === 'in') {
          // Handle TypeORM In operator
          const categories = where.category._value;
          filtered = filtered.filter(t => categories.includes(t.category));
        } else {
          filtered = filtered.filter(t => t.category === where.category);
        }
      }

      // Filter by profile
      if (where.profile && where.profile.id) {
        console.log('Filtering by profile.id:', where.profile.id);
        filtered = filtered.filter(t => {
          const match = t.profile?.id === where.profile.id;
          console.log('Transaction', t.id, 'profile match:', match, 'transaction profile:', t.profile?.id);
          return match;
        });
      }

      // Filter by business
      if (where.business && where.business.id) {
        console.log('Filtering by business.id:', where.business.id);
        filtered = filtered.filter(t => {
          const match = t.business?.id === where.business.id;
          console.log('Transaction', t.id, 'business match:', match, 'transaction business:', t.business?.id);
          return match;
        });
      }

      console.log('Filtered transactions:', filtered.length);
      return filtered.reduce((sum, t) => sum + t.amount, 0);
    }),
  };

  const mockLoanRepository = {
    find: jest.fn().mockImplementation(({ where }) => {
      const mockLoans = [
        { id: 1, principalAmount: 50000, interestRate: 5, remainingBalance: 40000, accountType: 'personal' },
        { id: 2, principalAmount: 100000, interestRate: 6, remainingBalance: 75000, accountType: 'business' },
      ];

      if (where.accountType) {
        return mockLoans.filter(l => l.accountType === where.accountType);
      }
      return mockLoans;
    }),
    sum: jest.fn().mockImplementation((field, where) => {
      const mockLoans = [
        { id: 1, principalAmount: 50000, interestRate: 5, remainingBalance: 40000, accountType: 'personal' },
        { id: 2, principalAmount: 100000, interestRate: 6, remainingBalance: 75000, accountType: 'business' },
      ];

      let filtered = mockLoans;

      if (where.accountType) {
        filtered = filtered.filter(l => l.accountType === where.accountType);
      }

      if (field === 'principalAmount') {
        return filtered.reduce((sum, l) => sum + l.principalAmount, 0);
      }

      return 0;
    }),
  };

  const mockBusinessRepository = {
    find: jest.fn().mockReturnValue([
      { id: 1, name: 'Test Business', revenue: 100000, expenses: 60000 },
    ]),
  };

  const mockProfileRepository = {
    findOne: jest.fn().mockReturnValue({
      id: 1,
      financialGoals: [
        { name: 'Retirement', targetAmount: 1000000, currentAmount: 200000 },
      ],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Loan),
          useValue: mockLoanRepository,
        },
        {
          provide: getRepositoryToken(Business),
          useValue: mockBusinessRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateFinancialSummary', () => {
    it('should generate financial summary for personal account', async () => {
      const result = await service.generateFinancialSummary(
        '1',
        'personal',
        '2023-01-01',
        '2023-01-31'
      );

      expect(result).toBeDefined();
      expect(result.income).toBe(10000);
      expect(result.expenses).toBe(8000); // 5000 + 2000 + 1000 (Food + Education + Tax Payment)
      expect(result.netProfit).toBe(2000);
      expect(result.debtToIncomeRatio).toBeDefined();
      expect(result.savingsRate).toBeDefined();
    });

    it('should generate financial summary for business account', async () => {
      const result = await service.generateFinancialSummary(
        '1',
        'business',
        '2023-02-01',
        '2023-02-28'
      );

      expect(result).toBeDefined();
      expect(result.income).toBe(20000);
      expect(result.expenses).toBe(8000);
      expect(result.netProfit).toBe(12000);
    });
  });

  describe('generateCashFlowReport', () => {
    it('should generate cash flow report', async () => {
      const result = await service.generateCashFlowReport(
        '1',
        'personal',
        '2023-01-01',
        '2023-01-31'
      );

      console.log('Cash Flow Result:', JSON.stringify(result, null, 2));

      expect(result).toBeDefined();
      expect(result.openingBalance).toBe(0);
      expect(result.closingBalance).toBe(2000);
      expect(result.totalInflows).toBe(10000);
      expect(result.totalOutflows).toBe(8000);
      expect(result.netCashFlow).toBe(2000);
    });
  });

  describe('generateTaxReport', () => {
    it('should generate tax report', async () => {
      const result = await service.generateTaxReport(
        '1',
        'personal',
        2023
      );

      expect(result).toBeDefined();
      expect(result.taxableIncome).toBe(10000);
      expect(result.deductions).toBeDefined();
      expect(result.taxLiability).toBeDefined();
      expect(result.taxRefund).toBeDefined();
    });
  });

  describe('generateBudgetReport', () => {
    it('should generate budget report', async () => {
      const result = await service.generateBudgetReport(
        '1',
        'personal',
        1,
        2023
      );

      expect(result).toBeDefined();
      expect(result.budgetCategories).toBeDefined();
      expect(result.totalBudget).toBeDefined();
      expect(result.totalActual).toBeDefined();
      expect(result.variances).toBeDefined();
    });
  });
});