import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProfilesRepository } from './profiles.repository';
import { Transaction } from '@finance-manager/db';
import { CreateProfileDto, ProfileResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';
import { TransactionType } from '@finance-manager/types';

const SENT_TRANSACTION_TYPES = new Set<TransactionType>([
  TransactionType.Expense,
  TransactionType.LoanGiven,
  TransactionType.RepaymentMade,
]);

const RECEIVED_TRANSACTION_TYPES = new Set<TransactionType>([
  TransactionType.Income,
  TransactionType.LoanTaken,
  TransactionType.RepaymentReceived,
]);

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    return this.profilesRepository.create(createProfileDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<ProfileResponseDto>> {
    return this.profilesRepository.findAll(query);
  }

  async findOne(id: string): Promise<ProfileResponseDto> {
    return this.profilesRepository.findOne(id);
  }

  async getTransactions(id: string, type?: TransactionType): Promise<any> {
    const whereConditions: any = {
      deletedAt: IsNull(),
      profileId: id,
    };

    if (type) {
      whereConditions.type = type;
    }

    const transactions = await this.transactionRepository.find({
      where: whereConditions,
      order: { date: 'DESC' },
    });

    const totals = transactions.reduce(
      (summary, transaction) => {
        if (SENT_TRANSACTION_TYPES.has(transaction.type)) {
          summary.totalSent += transaction.amount;
        }

        if (RECEIVED_TRANSACTION_TYPES.has(transaction.type)) {
          summary.totalReceived += transaction.amount;
        }

        return summary;
      },
      { totalSent: 0, totalReceived: 0 },
    );

    return {
      profileId: id,
      type: type || null,
      totals,
      transactions: transactions.map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        description: transaction.description,
        businessId: transaction.businessId,
        loanId: transaction.loanId,
      })),
    };
  }

  async update(id: string, updateProfileDto: Partial<CreateProfileDto>): Promise<ProfileResponseDto> {
    return this.profilesRepository.update(id, updateProfileDto);
  }

  async remove(id: string): Promise<void> {
    return this.profilesRepository.remove(id);
  }
}