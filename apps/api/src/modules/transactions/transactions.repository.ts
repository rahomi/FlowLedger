import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, Between } from 'typeorm';
import { Transaction } from '@finance-manager/db';
import { CreateTransactionDto, TransactionResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    await this.transactionRepository.save(transaction);
    return this.mapToResponseDto(transaction);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<TransactionResponseDto>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder, startDate, endDate, type, category } = query;

    const options: FindManyOptions<Transaction> = {
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    };

    if (search) {
      options.where = [
        { description: { $ilike: `%${search}%` } },
        { notes: { $ilike: `%${search}%` } },
      ];
    }

    if (type) {
      options.where = { ...options.where, type };
    }

    if (category) {
      options.where = { ...options.where, category };
    }

    if (startDate && endDate) {
      options.where = {
        ...options.where,
        date: Between(new Date(startDate), new Date(endDate))
      };
    }

    if (sortBy && sortOrder) {
      options.order = { [sortBy]: sortOrder };
    } else {
      options.order = { date: 'DESC' };
    }

    const [items, total] = await this.transactionRepository.findAndCount(options);

    return {
      items: items.map((item) => this.mapToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const options: FindOneOptions<Transaction> = {
      where: { id },
    };

    const transaction = await this.transactionRepository.findOne(options);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return this.mapToResponseDto(transaction);
  }

  async update(id: string, updateTransactionDto: Partial<CreateTransactionDto>): Promise<TransactionResponseDto> {
    const options: FindOneOptions<Transaction> = {
      where: { id },
    };

    const transaction = await this.transactionRepository.findOne(options);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    Object.assign(transaction, updateTransactionDto);
    await this.transactionRepository.save(transaction);

    return this.mapToResponseDto(transaction);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<Transaction> = {
      where: { id },
    };

    const transaction = await this.transactionRepository.findOne(options);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository.softRemove(transaction);
  }

  async getSummary(accountId: string, type: 'personal' | 'business'): Promise<any> {
    // Implement transaction summary logic
    // This would include financial metrics, spending patterns, etc.
    return {
      accountId,
      accountType: type,
      totalIncome: 0,
      totalExpenses: 0,
      netFlow: 0,
      categoryBreakdown: {},
      monthlyTrends: [],
    };
  }

  private mapToResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      accountType: transaction.accountType,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      notes: transaction.notes || '',
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}