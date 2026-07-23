import { EntityType } from '@finance-manager/types';

export interface CreateAttachmentDto {
  fileName: string;
  fileType: string;
  fileSize: number;
  entityType: EntityType;
  entityId: string;
}

export interface AttachmentResponseDto extends CreateAttachmentDto {
  id: string;
  filePath: string;
  createdAt: string;
}