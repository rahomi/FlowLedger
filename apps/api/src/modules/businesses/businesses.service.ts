import { Injectable } from '@nestjs/common';
import { BusinessesRepository } from './businesses.repository';
import { CreateBusinessDto, BusinessResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
    return this.businessesRepository.create(createBusinessDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<BusinessResponseDto>> {
    return this.businessesRepository.findAll(query);
  }

  async findOne(id: string): Promise<BusinessResponseDto> {
    return this.businessesRepository.findOne(id);
  }

  async update(id: string, updateBusinessDto: Partial<CreateBusinessDto>): Promise<BusinessResponseDto> {
    return this.businessesRepository.update(id, updateBusinessDto);
  }

  async remove(id: string): Promise<void> {
    return this.businessesRepository.remove(id);
  }

  async getSummary(id: string): Promise<any> {
    return this.businessesRepository.getSummary(id);
  }
}