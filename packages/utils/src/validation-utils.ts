import { TransactionType, LoanStatus, ProfileType, EntityType } from '@finance-manager/types';

export const isValidTransactionType = (type: string): type is TransactionType => {
  return Object.values(TransactionType).includes(type as TransactionType);
};

export const isValidLoanStatus = (status: string): status is LoanStatus => {
  return Object.values(LoanStatus).includes(status as LoanStatus);
};

export const isValidProfileType = (type: string): type is ProfileType => {
  return Object.values(ProfileType).includes(type as ProfileType);
};

export const isValidEntityType = (type: string): type is EntityType => {
  return Object.values(EntityType).includes(type as EntityType);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^[+\d][\d\s-]{7,}$/.test(phone);
};