export interface DashboardSummaryDto {
  totalIncome: number; // cents
  totalExpense: number; // cents
  netBalance: number; // cents
  loanGivenCount: number;
  loanTakenCount: number;
  loanGivenOutstanding: number; // cents
  loanTakenOutstanding: number; // cents
  overdueLoanCount: number;
}

export interface TrendDataPointDto {
  month: string; // YYYY-MM
  income: number; // cents
  expense: number; // cents
}

export interface CategoryBreakdownDto {
  category: string;
  amount: number; // cents
  percentage: number;
}