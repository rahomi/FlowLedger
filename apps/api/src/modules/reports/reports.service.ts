import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, In } from 'typeorm';
import { Transaction } from '@finance-manager/db';
import { Loan } from '@finance-manager/db';
import { Business } from '@finance-manager/db';
import { Profile } from '@finance-manager/db';
import { TransactionType, LoanStatus } from '@finance-manager/types';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async generateFinancialSummary(accountId: string, accountType: 'personal' | 'business', startDate: string, endDate: string): Promise<any> {
    const whereConditions: any = {
      deletedAt: null,
    };

    if (accountType === 'personal') {
      whereConditions.profile = { id: accountId };
    } else {
      whereConditions.business = { id: accountId };
    }

    if (startDate && endDate) {
      whereConditions.date = Between(new Date(startDate), new Date(endDate));
    }

    // Calculate income and expenses
    const [incomeResult, expenseResult] = await Promise.all([
      this.transactionRepository.sum('amount', {
        ...whereConditions,
        type: TransactionType.Income,
      }),
      this.transactionRepository.sum('amount', {
        ...whereConditions,
        type: TransactionType.Expense,
      }),
    ]);

    const income = incomeResult || 0;
    const expenses = expenseResult || 0;
    const netProfit = income - expenses;

    // Calculate debt (loans taken)
    const debtQuery: any = {
      type: 'taken',
      deletedAt: null,
    };

    if (accountType === 'personal') {
      debtQuery.borrowerProfile = { id: accountId };
    } else {
      debtQuery.borrowerBusiness = { id: accountId };
    }

    const totalDebtResult = await this.loanRepository.sum('principalAmount', debtQuery);
    const totalDebt = totalDebtResult || 0;

    // Calculate debt to income ratio
    const debtToIncomeRatio = income > 0 ? (totalDebt / income) : 0;

    // Calculate savings rate (income - expenses) / income
    const savingsRate = income > 0 ? (netProfit / income) : 0;

    return {
      accountId,
      accountType,
      period: { startDate, endDate },
      income,
      expenses,
      netProfit,
      cashFlow: netProfit,
      debtToIncomeRatio,
      savingsRate,
      totalDebt,
    };
  }

  async generateCashFlowReport(accountId: string, accountType: 'personal' | 'business', startDate: string, endDate: string): Promise<any> {
    const whereConditions: any = {
      deletedAt: null,
      date: Between(new Date(startDate), new Date(endDate)),
    };

    if (accountType === 'personal') {
      whereConditions.profile = { id: accountId };
    } else {
      whereConditions.business = { id: accountId };
    }

    // Get all transactions in the period
    const transactions = await this.transactionRepository.find({
      where: whereConditions,
      order: { date: 'ASC' },
    });

    // Calculate opening balance (balance before start date)
    const openingBalanceQuery: any = {
      deletedAt: null,
      date: LessThan(new Date(startDate)),
    };

    if (accountType === 'personal') {
      openingBalanceQuery.profile = { id: accountId };
    } else {
      openingBalanceQuery.business = { id: accountId };
    }

    const [incomeBefore, expenseBefore] = await Promise.all([
      this.transactionRepository.sum('amount', {
        ...openingBalanceQuery,
        type: TransactionType.Income,
      }),
      this.transactionRepository.sum('amount', {
        ...openingBalanceQuery,
        type: TransactionType.Expense,
      }),
    ]);

    const openingBalance = (incomeBefore || 0) - (expenseBefore || 0);

    // Group transactions by type
    const inflows = transactions
      .filter((t: any) => t.type === TransactionType.Income)
      .map((t: any) => ({
        id: t.id,
        date: t.date,
        amount: t.amount,
        category: t.category,
        description: t.description,
      }));

    const outflows = transactions
      .filter((t: any) => t.type === TransactionType.Expense)
      .map((t: any) => ({
        id: t.id,
        date: t.date,
        amount: t.amount,
        category: t.category,
        description: t.description,
      }));

    // Calculate net cash flow
    const totalInflows = inflows.reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalOutflows = outflows.reduce((sum: number, t: any) => sum + t.amount, 0);
    const netCashFlow = totalInflows - totalOutflows;
    const closingBalance = openingBalance + netCashFlow;

    return {
      accountId,
      accountType,
      period: { startDate, endDate },
      openingBalance,
      closingBalance,
      inflows,
      outflows,
      netCashFlow,
      totalInflows,
      totalOutflows,
    };
  }

  async generateTaxReport(accountId: string, accountType: 'personal' | 'business', year: number): Promise<any> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const whereConditions: any = {
      deletedAt: null,
      date: Between(startDate, endDate),
    };

    if (accountType === 'personal') {
      whereConditions.profile = { id: accountId };
    } else {
      whereConditions.business = { id: accountId };
    }

    // Calculate taxable income (all income transactions)
    const incomeResult = await this.transactionRepository.sum('amount', {
      ...whereConditions,
      type: TransactionType.Income,
    });

    const taxableIncome = incomeResult || 0;

    // Calculate deductions (business expenses for business accounts, specific categories for personal)
    let deductions = 0;
    if (accountType === 'business') {
      // For business accounts, all expenses are potentially deductible
      const expenseResult = await this.transactionRepository.sum('amount', {
        ...whereConditions,
        type: TransactionType.Expense,
      });
      deductions = expenseResult || 0;
    } else {
      // For personal accounts, only specific categories might be deductible
      // This is a simplified approach - real tax rules would be more complex
      const deductibleCategories = ['Education', 'Medical', 'Charity', 'Home Office'];
      const deductibleExpenses = await this.transactionRepository.find({
        where: {
          ...whereConditions,
          type: TransactionType.Expense,
          category: In(deductibleCategories),
        },
        select: ['amount'],
      });
      deductions = deductibleExpenses.reduce((sum: number, t: any) => sum + t.amount, 0);
    }

    // Simplified tax calculation (real implementation would use tax brackets and rules)
    const taxRate = accountType === 'business' ? 0.25 : 0.20; // 25% for business, 20% for personal
    const taxableAmount = Math.max(0, taxableIncome - deductions);
    const taxLiability = taxableAmount * taxRate;

    // Check for tax payments made
    const taxPayments = await this.transactionRepository.sum('amount', {
      ...whereConditions,
      type: TransactionType.Expense,
      category: 'Tax Payment',
    });

    const taxPaid = taxPayments || 0;
    const taxRefund = Math.max(0, taxPaid - taxLiability);

    return {
      accountId,
      accountType,
      taxYear: year,
      taxableIncome,
      deductions,
      taxableAmount,
      taxLiability,
      taxPaid,
      taxRefund,
      effectiveTaxRate: taxableAmount > 0 ? (taxLiability / taxableAmount) : 0,
    };
  }

  async generateBudgetReport(accountId: string, accountType: 'personal' | 'business', month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const whereConditions: any = {
      deletedAt: null,
      date: Between(startDate, endDate),
    };

    if (accountType === 'personal') {
      whereConditions.profile = { id: accountId };
    } else {
      whereConditions.business = { id: accountId };
    }

    // Get all transactions for the month
    const transactions = await this.transactionRepository.find({
      where: {
        ...whereConditions,
        type: TransactionType.Expense,
      },
    });

    // Group by category
    const categoryMap: Record<string, { category: string; amount: number }> = {};
    transactions.forEach((t: any) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { category: t.category, amount: 0 };
      }
      categoryMap[t.category].amount += t.amount;
    });

    const actualSpending = Object.values(categoryMap);

    // In a real implementation, we would fetch budget targets from a budget table
    // For now, we'll use some reasonable defaults
    const defaultBudgets = {
      'Housing': 150000, // $1500
      'Food': 60000,     // $600
      'Transportation': 30000, // $300
      'Entertainment': 20000, // $200
      'Utilities': 100000, // $1000
      'Education': 50000,  // $500
      'Healthcare': 40000, // $400
      'Other': 100000,    // $1000
    };

    const budgetCategories = Object.keys(defaultBudgets).map(category => ({
      category,
      budgetAmount: defaultBudgets[category as keyof typeof defaultBudgets],
    }));

    // Calculate variances
    const variances = budgetCategories.map((bc: any) => {
      const actual = actualSpending.find((as: any) => as.category === bc.category);
      const varianceAmount = (actual?.amount || 0) - bc.budgetAmount;
      const variancePercent = bc.budgetAmount > 0 ? (varianceAmount / bc.budgetAmount) : 0;

      return {
        category: bc.category,
        budgetAmount: bc.budgetAmount,
        actualAmount: actual?.amount || 0,
        varianceAmount,
        variancePercent,
        status: Math.abs(variancePercent) < 0.1 ? 'on_track' : variancePercent < 0 ? 'under_budget' : 'over_budget',
      };
    });

    // Determine overall status
    const overBudgetCount = variances.filter(v => v.status === 'over_budget' && Math.abs(v.variancePercent) > 0.2).length;
    const overallStatus = overBudgetCount === 0 ? 'on_track' : overBudgetCount <= 2 ? 'minor_issues' : 'needs_attention';

    return {
      accountId,
      accountType,
      period: { month, year },
      budgetCategories,
      actualSpending,
      variances,
      overallStatus,
      totalBudget: budgetCategories.reduce((sum, bc) => sum + bc.budgetAmount, 0),
      totalActual: actualSpending.reduce((sum, as) => sum + as.amount, 0),
      overallVariance: variances.reduce((sum, v) => sum + v.varianceAmount, 0),
    };
  }
}