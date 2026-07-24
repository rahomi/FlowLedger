import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, ILike } from 'typeorm';
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
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;

    const options: FindManyOptions<Loan> = {
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    };

    if (search) {
      options.where = [
        { description: ILike(`%${search}%`) },
      ];
    }

    if (status) {
      options.where = { ...options.where, status: status as any };
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
      type: loan.type,
      principalAmount: loan.principalAmount,
      paidAmount: loan.paidAmount,
      startDate: loan.startDate.toISOString(),
      dueDate: loan.dueDate?.toISOString(),
      lenderProfileId: loan.lenderProfileId,
      borrowerProfileId: loan.borrowerProfileId,
      status: loan.status,
      description: loan.description,
      createdAt: loan.createdAt.toISOString(),
      updatedAt: loan.updatedAt.toISOString(),
    };
  }
}