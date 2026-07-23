import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Loan } from '@finance-manager/db';
import { CreateLoanDto, LoanResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class LoansRepository {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<LoanResponseDto> {
    const loan = this.loanRepository.create(createLoanDto);
    await this.loanRepository.save(loan);
    return this.mapToResponseDto(loan);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<LoanResponseDto>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder, status } = query;

    const options: FindManyOptions<Loan> = {
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    };

    if (search) {
      options.where = [
        { lender: { $ilike: `%${search}%` } },
        { purpose: { $ilike: `%${search}%` } },
      ];
    }

    if (status) {
      options.where = { ...options.where, status };
    }

    if (sortBy && sortOrder) {
      options.order = { [sortBy]: sortOrder };
    }

    const [items, total] = await this.loanRepository.findAndCount(options);

    return {
      items: items.map((item) => this.mapToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<LoanResponseDto> {
    const options: FindOneOptions<Loan> = {
      where: { id },
    };

    const loan = await this.loanRepository.findOne(options);

    if (!loan) {
      throw new Error('Loan not found');
    }

    return this.mapToResponseDto(loan);
  }

  async update(id: string, updateLoanDto: Partial<CreateLoanDto>): Promise<LoanResponseDto> {
    const options: FindOneOptions<Loan> = {
      where: { id },
    };

    const loan = await this.loanRepository.findOne(options);

    if (!loan) {
      throw new Error('Loan not found');
    }

    Object.assign(loan, updateLoanDto);
    await this.loanRepository.save(loan);

    return this.mapToResponseDto(loan);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<Loan> = {
      where: { id },
    };

    const loan = await this.loanRepository.findOne(options);

    if (!loan) {
      throw new Error('Loan not found');
    }

    await this.loanRepository.softRemove(loan);
  }

  async calculateAmortizationSchedule(loanId: string): Promise<any> {
    // Implement loan amortization schedule calculation
    // This would include payment breakdown, interest calculations, etc.
    return {
      loanId,
      schedule: [],
      totalInterest: 0,
      totalPayments: 0,
    };
  }

  private mapToResponseDto(loan: Loan): LoanResponseDto {
    return {
      id: loan.id,
      accountId: loan.accountId,
      accountType: loan.accountType,
      lender: loan.lender,
      amount: loan.amount,
      currency: loan.currency,
      interestRate: loan.interestRate,
      termMonths: loan.termMonths,
      startDate: loan.startDate,
      endDate: loan.endDate,
      status: loan.status,
      purpose: loan.purpose,
      notes: loan.notes || '',
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    };
  }
}