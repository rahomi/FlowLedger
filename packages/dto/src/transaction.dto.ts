import { TransactionType } from '@finance-manager/types';

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number; // cents
  date: string; // ISO date (UTC)
  category: string;
  description?: string;
  profileId?: string; // UUID
  businessId?: string;
  loanId?: string;
  attachmentIds?: string[];
}

export interface TransactionResponseDto extends CreateTransactionDto {
  id: string;
  isReconciled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}