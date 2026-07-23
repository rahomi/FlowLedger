import { Injectable } from '@nestjs/common';
import { LoansRepository } from './loans.repository';
import { CreateLoanDto, LoanResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class LoansService {
  constructor(private readonly loansRepository: LoansRepository) {}

  async create(createLoanDto: CreateLoanDto): Promise<LoanResponseDto> {
    return this.loansRepository.create(createLoanDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<LoanResponseDto>> {
    return this.loansRepository.findAll(query);
  }

  async findOne(id: string): Promise<LoanResponseDto> {
    return this.loansRepository.findOne(id);
  }

  async update(id: string, updateLoanDto: Partial<CreateLoanDto>): Promise<LoanResponseDto> {
    return this.loansRepository.update(id, updateLoanDto);
  }

  async remove(id: string): Promise<void> {
    return this.loansRepository.remove(id);
  }

  async calculateAmortizationSchedule(loanId: string): Promise<any> {
    return this.loansRepository.calculateAmortizationSchedule(loanId);
  }
}