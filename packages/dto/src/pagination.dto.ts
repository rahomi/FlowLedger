export interface PaginatedRequestDto {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
}

export interface PaginatedResultDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}