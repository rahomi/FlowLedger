// Shared enums and types
export enum TransactionType {
  Income = "income",
  Expense = "expense",
  LoanGiven = "loan_given",
  LoanTaken = "loan_taken",
  RepaymentReceived = "repayment_received",
  RepaymentMade = "repayment_made"
}

export enum LoanStatus {
  Active = "active",
  Paid = "paid",
  Overdue = "overdue"
}

export enum ProfileType {
  Person = "person",
  Business = "business",
  Organization = "organization",
  Other = "other"
}

export enum EntityType {
  Transaction = "transaction",
  Profile = "profile",
  Loan = "loan",
  Business = "business"
}

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};