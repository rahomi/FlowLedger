import { Injectable } from '@nestjs/common';
import { PersonalRepository } from './personal.repository';
import { CreatePersonalAccountDto, PersonalAccountResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class PersonalService {
  constructor(private readonly personalRepository: PersonalRepository) {}

  async create(createPersonalAccountDto: CreatePersonalAccountDto): Promise<PersonalAccountResponseDto> {
    return this.personalRepository.create(createPersonalAccountDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<PersonalAccountResponseDto>> {
    return this.personalRepository.findAll(query);
  }

  async findOne(id: string): Promise<PersonalAccountResponseDto> {
    return this.personalRepository.findOne(id);
  }

  async update(id: string, updatePersonalAccountDto: Partial<CreatePersonalAccountDto>): Promise<PersonalAccountResponseDto> {
    return this.personalRepository.update(id, updatePersonalAccountDto);
  }

  async remove(id: string): Promise<void> {
    return this.personalRepository.remove(id);
  }

  async getSummary(id: string): Promise<any> {
    return this.personalRepository.getSummary(id);
  }
}