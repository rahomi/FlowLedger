import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Business } from '@finance-manager/db';
import { CreateBusinessDto, BusinessResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class BusinessesRepository {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
    const business = this.businessRepository.create(createBusinessDto);
    await this.businessRepository.save(business);
    return this.mapToResponseDto(business);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<BusinessResponseDto>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;

    const options: FindManyOptions<Business> = {
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

    const [items, total] = await this.businessRepository.findAndCount(options);

    return {
      items: items.map((item) => this.mapToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<BusinessResponseDto> {
    const options: FindOneOptions<Business> = {
      where: { id },
    };

    const business = await this.businessRepository.findOne(options);

    if (!business) {
      throw new Error('Business not found');
    }

    return this.mapToResponseDto(business);
  }

  async update(id: string, updateBusinessDto: Partial<CreateBusinessDto>): Promise<BusinessResponseDto> {
    const options: FindOneOptions<Business> = {
      where: { id },
    };

    const business = await this.businessRepository.findOne(options);

    if (!business) {
      throw new Error('Business not found');
    }

    Object.assign(business, updateBusinessDto);
    await this.businessRepository.save(business);

    return this.mapToResponseDto(business);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<Business> = {
      where: { id },
    };

    const business = await this.businessRepository.findOne(options);

    if (!business) {
      throw new Error('Business not found');
    }

    await this.businessRepository.softRemove(business);
  }

  async getSummary(id: string): Promise<any> {
    // Implement business summary logic
    // This would include financial metrics, recent transactions, etc.
    return {
      businessId: id,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      recentTransactions: [],
    };
  }

  private mapToResponseDto(business: Business): BusinessResponseDto {
    return {
      id: business.id,
      name: business.name,
      description: business.description || '',
      industry: business.industry,
      establishedDate: business.establishedDate,
      contactEmail: business.contactEmail || '',
      contactPhone: business.contactPhone || '',
      address: business.address || '',
      taxId: business.taxId || '',
      currency: business.currency,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    };
  }
}