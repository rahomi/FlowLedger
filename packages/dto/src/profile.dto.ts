import { ProfileType } from '@finance-manager/types';

export interface CreateProfileDto {
  type: ProfileType;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  notes?: string;
}

export interface ProfileResponseDto extends CreateProfileDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}