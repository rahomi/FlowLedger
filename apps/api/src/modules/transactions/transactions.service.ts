import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto, TransactionResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.transactionsRepository.create(createTransactionDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<TransactionResponseDto>> {
    return this.transactionsRepository.findAll(query);
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    return this.transactionsRepository.findOne(id);
  }

  async update(id: string, updateTransactionDto: Partial<CreateTransactionDto>): Promise<TransactionResponseDto> {
    return this.transactionsRepository.update(id, updateTransactionDto);
  }

  async remove(id: string): Promise<void> {
    return this.transactionsRepository.remove(id);
  }

  async getSummary(accountId: string, type: 'personal' | 'business'): Promise<any> {
    return this.transactionsRepository.getSummary(accountId, type);
  }
}