export interface IncomeReportDto {
  month: string; // YYYY-MM
  categories: {
    [category: string]: number; // cents
  };
  total: number; // cents
}

export interface ExpenseReportDto {
  month: string; // YYYY-MM
  categories: {
    [category: string]: number; // cents
  };
  total: number; // cents
}

export interface ProfitLossReportDto {
  period: string; // YYYY-MM or custom range
  income: number; // cents
  expense: number; // cents
  profit: number; // cents
}

export interface LoanReportDto {
  id: string;
  type: 'given' | 'taken';
  principalAmount: number; // cents
  paidAmount: number; // cents
  remainingAmount: number; // cents
  status: string;
  lenderName: string;
  borrowerName: string;
  startDate: string;
  dueDate?: string;
  daysOverdue?: number;
}