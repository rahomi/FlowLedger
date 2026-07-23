import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Attachment } from '@finance-manager/db';
import { CreateAttachmentDto, AttachmentResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class AttachmentsRepository {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto): Promise<AttachmentResponseDto> {
    const attachment = this.attachmentRepository.create(createAttachmentDto);
    await this.attachmentRepository.save(attachment);
    return this.mapToResponseDto(attachment);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<AttachmentResponseDto>> {
    const { page = 1, limit = 10, entityType, entityId } = query;

    const options: FindManyOptions<Attachment> = {
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    };

    if (entityType) {
      options.where = { ...options.where, entityType };
    }

    if (entityId) {
      options.where = { ...options.where, entityId };
    }

    const [items, total] = await this.attachmentRepository.findAndCount(options);

    return {
      items: items.map((item) => this.mapToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<AttachmentResponseDto> {
    const options: FindOneOptions<Attachment> = {
      where: { id },
    };

    const attachment = await this.attachmentRepository.findOne(options);

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    return this.mapToResponseDto(attachment);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<Attachment> = {
      where: { id },
    };

    const attachment = await this.attachmentRepository.findOne(options);

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    await this.attachmentRepository.softRemove(attachment);
  }

  private mapToResponseDto(attachment: Attachment): AttachmentResponseDto {
    return {
      id: attachment.id,
      entityId: attachment.entityId,
      entityType: attachment.entityType,
      fileName: attachment.fileName,
      fileType: attachment.fileType,
      fileSize: attachment.fileSize,
      fileUrl: attachment.fileUrl,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt,
    };
  }
}