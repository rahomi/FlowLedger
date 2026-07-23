import { LoanStatus } from '@finance-manager/types';

export interface CreateLoanDto {
  type: 'given' | 'taken';
  principalAmount: number; // cents
  startDate: string; // ISO date
  dueDate?: string;
  lenderProfileId: string;
  borrowerProfileId: string;
  description?: string;
}

export interface LoanResponseDto extends CreateLoanDto {
  id: string;
  paidAmount: number;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}