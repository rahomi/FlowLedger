import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Profile } from '@finance-manager/db';
import { CreateProfileDto, ProfileResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    const profile = this.profileRepository.create(createProfileDto);
    await this.profileRepository.save(profile);
    return this.mapToResponseDto(profile);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<ProfileResponseDto>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;

    const options: FindManyOptions<Profile> = {
      where: {},
      skip: (page - 1) * limit,
      take: limit,
    };

    if (search) {
      options.where = [
        { firstName: { $ilike: `%${search}%` } },
        { lastName: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
      ];
    }

    if (sortBy && sortOrder) {
      options.order = { [sortBy]: sortOrder };
    }

    const [items, total] = await this.profileRepository.findAndCount(options);

    return {
      items: items.map((item) => this.mapToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ProfileResponseDto> {
    const options: FindOneOptions<Profile> = {
      where: { id },
    };

    const profile = await this.profileRepository.findOne(options);

    if (!profile) {
      throw new Error('Profile not found');
    }

    return this.mapToResponseDto(profile);
  }

  async update(id: string, updateProfileDto: Partial<CreateProfileDto>): Promise<ProfileResponseDto> {
    const options: FindOneOptions<Profile> = {
      where: { id },
    };

    const profile = await this.profileRepository.findOne(options);

    if (!profile) {
      throw new Error('Profile not found');
    }

    Object.assign(profile, updateProfileDto);
    await this.profileRepository.save(profile);

    return this.mapToResponseDto(profile);
  }

  async remove(id: string): Promise<void> {
    const options: FindOneOptions<Profile> = {
      where: { id },
    };

    const profile = await this.profileRepository.findOne(options);

    if (!profile) {
      throw new Error('Profile not found');
    }

    await this.profileRepository.softRemove(profile);
  }

  private mapToResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone || '',
      address: profile.address || '',
      dateOfBirth: profile.dateOfBirth || null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}