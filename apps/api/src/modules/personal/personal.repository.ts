import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { PersonalAccount } from '@finance-manager/db';
import { CreatePersonalAccountDto, PersonalAccountResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class PersonalRepository {
  constructor(
    @InjectRepository(PersonalAccount)
    private readonly personalAccountRepository: Repository<PersonalAccount>,
  ) {}

  async create(createPersonalAccountDto: CreatePersonalAccountDto): Promise<PersonalAccountResponseDto> {
    const account = this.personalAccountRepository.create(createPersonalAccountDto);
    await this.personalAccountRepository.save(account);
    return this.mapToResponseDto(account);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<PersonalAccountResponseDto>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;

    const options: FindManyOptions<PersonalAccount> = {
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    };

    if (search) {
      options.where = [
        { name: { $ilike: `%${search}%` } },
        { description: { $ilike: `%${search}%` } },
      ];
    }

    if (sortBy && sortOrder) {
      options.order = { [sortBy]: sortOrder };
    }

    const [items, total] = await this.personalAccountRepository.findAndCount(options);

    return {
      items: items.map((item) => this.mapToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PersonalAccountResponseDto> {
    const options: FindOneOptions<PersonalAccount> = {
      where: { id },
    };

    const account = await this.personalAccountRepository.findOne(options);

    if (!account) {
      throw new Error('Personal account not found');
    }

    return this.mapToResponseDto(account);
  }

  async update(id: string, updatePersonalAccountDto: Partial<CreatePersonalAccountDto>): Promise<PersonalAccountResponseDto> {
    const options: FindOneOptions<PersonalAccount> = {
      where: { id },
    };

    const account = await this.personalAccountRepository.findOne(options);

    if (!account) {
      throw new Error('Personal account not found');
    }

    Object.assign(account, updatePersonalAccountDto);
    await this.personalAccountRepository.save(account);

    return this.mapToResponseDto(account);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<PersonalAccount> = {
      where: { id },
    };

    const account = await this.personalAccountRepository.findOne(options);

    if (!account) {
      throw new Error('Personal account not found');
    }

    await this.personalAccountRepository.softRemove(account);
  }

  async getSummary(id: string): Promise<any> {
    // Implement personal account summary logic
    // This would include financial metrics, recent transactions, budget status, etc.
    return {
      accountId: id,
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      budgetStatus: 'on_track',
      recentTransactions: [],
    };
  }

  private mapToResponseDto(account: PersonalAccount): PersonalAccountResponseDto {
    return {
      id: account.id,
      name: account.name,
      description: account.description || '',
      accountType: account.accountType,
      currency: account.currency,
      initialBalance: account.initialBalance,
      currentBalance: account.currentBalance,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}