export interface CreateBusinessDto {
  name: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface BusinessResponseDto extends CreateBusinessDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}