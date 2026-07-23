export interface PaginatedRequestDto {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResultDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}