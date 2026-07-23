import { Injectable } from '@nestjs/common';
import { AttachmentsRepository } from './attachments.repository';
import { CreateAttachmentDto, AttachmentResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class AttachmentsService {
  constructor(private readonly attachmentsRepository: AttachmentsRepository) {}

  async create(createAttachmentDto: CreateAttachmentDto): Promise<AttachmentResponseDto> {
    return this.attachmentsRepository.create(createAttachmentDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<AttachmentResponseDto>> {
    return this.attachmentsRepository.findAll(query);
  }

  async findOne(id: string): Promise<AttachmentResponseDto> {
    return this.attachmentsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    return this.attachmentsRepository.remove(id);
  }
}