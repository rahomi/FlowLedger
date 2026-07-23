import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto, AttachmentResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  create(@Body() createAttachmentDto: CreateAttachmentDto): Promise<AttachmentResponseDto> {
    return this.attachmentsService.create(createAttachmentDto);
  }

  @Get()
  findAll(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<AttachmentResponseDto>> {
    return this.attachmentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AttachmentResponseDto> {
    return this.attachmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.attachmentsService.remove(id);
  }
}