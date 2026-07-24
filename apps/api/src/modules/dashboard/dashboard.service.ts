import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan, IsNull, In } from 'typeorm';
import { Transaction } from '@finance-manager/db';
import { Loan } from '@finance-manager/db';
import { Business } from '@finance-manager/db';
import { Profile } from '@finance-manager/db';
import { TransactionType, LoanStatus } from '@finance-manager/types';

@Injectable()
export class DashboardService {
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

  async getOverview(userId: string, dateRange?: { startDate?: string; endDate?: string }): Promise<any> {
    const { startDate, endDate } = dateRange || {};

    // Calculate date range filters
    const whereConditions: any = { deletedAt: null };
    if (startDate && endDate) {
      whereConditions.date = Between(new Date(startDate), new Date(endDate));
    }

    // Get income and expense totals
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

    const totalIncome = incomeResult || 0;
    const totalExpense = expenseResult || 0;
    const netBalance = totalIncome - totalExpense;

    // Get recent transactions (last 10, newest first)
    const recentTransactions = await this.transactionRepository.find({
      where: { ...whereConditions, deletedAt: null },
      order: { date: 'DESC' },
      take: 10,
      relations: ['profile', 'business'],
    });

    // Get loan summary
    const [loansGiven, loansTaken] = await Promise.all([
      this.loanRepository.count({ where: { type: 'given', deletedAt: IsNull() } }),
      this.loanRepository.count({ where: { type: 'taken', deletedAt: IsNull() } }),
    ]);

    // Get overdue loans
    const overdueLoans = await this.loanRepository.find({
      where: {
        status: LoanStatus.Overdue,
        deletedAt: IsNull(),
        dueDate: LessThan(new Date()),
      },
      relations: ['lenderProfile', 'borrowerProfile'],
    });

    // Get business count
    const businessCount = await this.businessRepository.count({
      where: { deletedAt: IsNull() },
    });

    return {
      userId,
      period: { startDate, endDate },
      financialMetrics: {
        totalIncome,
        totalExpense,
        netBalance,
        profitLoss: netBalance,
      },
      loanMetrics: {
        loansGiven,
        loansTaken,
        totalLoans: loansGiven + loansTaken,
        overdueLoans: overdueLoans.length,
      },
      businessMetrics: {
        totalBusinesses: businessCount,
      },
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        date: t.date,
        category: t.category,
        description: t.description,
        profile: t.profile ? {
          id: t.profile.id,
          name: t.profile.name,
          type: t.profile.type,
        } : null,
        business: t.business ? {
          id: t.business.id,
          name: t.business.name,
        } : null,
      })),
      overdueLoans: overdueLoans.map(loan => ({
        id: loan.id,
        type: loan.type,
        principalAmount: loan.principalAmount,
        paidAmount: loan.paidAmount,
        remainingAmount: loan.principalAmount - loan.paidAmount,
        dueDate: loan.dueDate,
        daysOverdue: loan.dueDate ? Math.floor((new Date().getTime() - new Date(loan.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        lender: loan.lenderProfile ? {
          id: loan.lenderProfile.id,
          name: loan.lenderProfile.name,
        } : null,
        borrower: loan.borrowerProfile ? {
          id: loan.borrowerProfile.id,
          name: loan.borrowerProfile.name,
        } : null,
      })),
    };
  }

  async getIncomeExpenseTrends(userId: string, months: number = 6): Promise<any> {
    // Get trends for the last N months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const transactions = await this.transactionRepository.find({
      where: {
        deletedAt: IsNull(),
        date: Between(startDate, endDate),
        type: In([TransactionType.Income, TransactionType.Expense]),
      },
      order: { date: 'ASC' },
    });

    // Group by month
    const monthlyData: Record<string, { income: number; expense: number; month: string }> = {};
    transactions.forEach(transaction => {
      const monthKey = `${transaction.date.getFullYear()}-${String(transaction.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, month: monthKey };
      }
      if (transaction.type === TransactionType.Income) {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    // Convert to array and sort by month
    const result = Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month));

    return {
      userId,
      period: { startDate, endDate },
      trends: result,
    };
  }

  async getCategoryBreakdown(userId: string, dateRange?: { startDate?: string; endDate?: string }): Promise<any> {
    const { startDate, endDate } = dateRange || {};

    const whereConditions: any = {
      deletedAt: null,
      type: [TransactionType.Income, TransactionType.Expense],
    };

    if (startDate && endDate) {
      whereConditions.date = Between(new Date(startDate), new Date(endDate));
    }

    const transactions = await this.transactionRepository.find({
      where: whereConditions,
      select: ['category', 'amount', 'type'],
    });

    // Group by category and type
    const categoryData: Record<string, { category: string; type: TransactionType; amount: number }> = {};
    transactions.forEach(transaction => {
      const key = `${transaction.type}-${transaction.category}`;
      if (!categoryData[key]) {
        categoryData[key] = { category: transaction.category, type: transaction.type, amount: 0 };
      }
      categoryData[key].amount += transaction.amount;
    });

    // Convert to array
    const result = Object.values(categoryData);

    return {
      userId,
      period: { startDate, endDate },
      categories: result,
    };
  }

  async getFinancialHealth(userId: string): Promise<any> {
    // Calculate financial health metrics
    const [totalIncome, totalExpense, totalLoansGiven, totalLoansTaken] = await Promise.all([
      this.transactionRepository.sum('amount', {
        type: TransactionType.Income,
        deletedAt: IsNull(),
      }),
      this.transactionRepository.sum('amount', {
        type: TransactionType.Expense,
        deletedAt: IsNull(),
      }),
      this.loanRepository.sum('principalAmount', {
        type: 'given',
        deletedAt: IsNull(),
      }),
      this.loanRepository.sum('principalAmount', {
        type: 'taken',
        deletedAt: IsNull(),
      }),
    ]);

    const netIncome = (totalIncome || 0) - (totalExpense || 0);
    const totalDebt = totalLoansTaken || 0;
    const debtToIncomeRatio = netIncome > 0 ? (totalDebt / netIncome) : 0;

    // Simple financial health score (0-100)
    let financialHealthScore = 0;
    if (netIncome > 0) financialHealthScore += 30;
    if (debtToIncomeRatio < 0.3) financialHealthScore += 30;
    if (debtToIncomeRatio < 0.1) financialHealthScore += 20;
    if (totalLoansGiven && totalLoansTaken && totalLoansGiven > totalLoansTaken) financialHealthScore += 10;

    financialHealthScore = Math.min(100, Math.max(0, financialHealthScore));

    return {
      userId,
      financialMetrics: {
        totalIncome: totalIncome || 0,
        totalExpense: totalExpense || 0,
        netIncome,
        totalDebt: totalDebt || 0,
        debtToIncomeRatio,
      },
      financialHealthScore,
      recommendations: this.generateRecommendations(debtToIncomeRatio, netIncome),
    };
  }

  private generateRecommendations(debtToIncomeRatio: number, netIncome: number): string[] {
    const recommendations = [];

    if (debtToIncomeRatio > 0.4) {
      recommendations.push('Your debt-to-income ratio is high. Consider paying down debt to improve financial health.');
    }

    if (netIncome < 0) {
      recommendations.push('You are spending more than you earn. Review your expenses and consider budget adjustments.');
    }

    if (debtToIncomeRatio < 0.2 && netIncome > 0) {
      recommendations.push('Your financial health looks good! Consider investing surplus funds for long-term growth.');
    }

    return recommendations;
  }

  async getAlerts(userId: string): Promise<any> {
    const today = new Date();

    // Get overdue loans
    const overdueLoans = await this.loanRepository.find({
      where: {
        status: LoanStatus.Overdue,
        deletedAt: IsNull(),
        dueDate: LessThan(today),
      },
      relations: ['lenderProfile', 'borrowerProfile'],
    });

    // Get upcoming loan due dates (within next 7 days)
    const upcomingDueDate = new Date();
    upcomingDueDate.setDate(upcomingDueDate.getDate() + 7);

    const upcomingLoans = await this.loanRepository.find({
      where: {
        status: LoanStatus.Active,
        deletedAt: IsNull(),
        dueDate: Between(today, upcomingDueDate),
      },
      relations: ['lenderProfile', 'borrowerProfile'],
    });

    // Get large transactions in last 7 days (> 100,000 cents = $1000)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const largeTransactions = await this.transactionRepository.find({
      where: {
        deletedAt: IsNull(),
        date: Between(sevenDaysAgo, today),
        amount: MoreThan(100000), // > $1000
      },
      order: { amount: 'DESC' },
      take: 5,
    });

    return {
      userId,
      alerts: [
        ...overdueLoans.map(loan => ({
          type: 'loan_overdue',
          severity: 'high',
          message: `Loan ${loan.type === 'given' ? 'given to' : 'taken from'} ${loan.type === 'given' ? loan.borrowerProfile?.name : loan.lenderProfile?.name} is overdue by ${loan.dueDate ? Math.floor((today.getTime() - new Date(loan.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0} days`,
          loanId: loan.id,
          daysOverdue: loan.dueDate ? Math.floor((today.getTime() - new Date(loan.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
          amount: loan.principalAmount - loan.paidAmount,
        })),
        ...upcomingLoans.map(loan => ({
          type: 'loan_due_soon',
          severity: 'medium',
          message: `Loan ${loan.type === 'given' ? 'given to' : 'taken from'} ${loan.type === 'given' ? loan.borrowerProfile?.name : loan.lenderProfile?.name} is due in ${loan.dueDate ? Math.floor((new Date(loan.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0} days`,
          loanId: loan.id,
          daysUntilDue: loan.dueDate ? Math.floor((new Date(loan.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0,
          amount: loan.principalAmount - loan.paidAmount,
        })),
        ...largeTransactions.map(tx => ({
          type: 'large_transaction',
          severity: 'low',
          message: `Large transaction: ${tx.type} of ${tx.amount / 100} in category ${tx.category}`,
          transactionId: tx.id,
          amount: tx.amount,
          date: tx.date,
        })),
      ],
      notificationCount: overdueLoans.length + upcomingLoans.length + largeTransactions.length,
    };
  }
}