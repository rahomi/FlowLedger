// Convert cents to formatted currency
export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount / 100);
};

// Convert formatted currency to cents
export const parseAmount = (amount: string): number => {
  const cleaned = amount.replace(/[^\d.-]/g, '');
  const value = parseFloat(cleaned);
  return Math.round(value * 100);
};

// Calculate percentage
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};