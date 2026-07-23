import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { CreateProfileDto, ProfileResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    return this.profilesRepository.create(createProfileDto);
  }

  async findAll(query: PaginatedRequestDto): Promise<PaginatedResultDto<ProfileResponseDto>> {
    return this.profilesRepository.findAll(query);
  }

  async findOne(id: string): Promise<ProfileResponseDto> {
    return this.profilesRepository.findOne(id);
  }

  async update(id: string, updateProfileDto: Partial<CreateProfileDto>): Promise<ProfileResponseDto> {
    return this.profilesRepository.update(id, updateProfileDto);
  }

  async remove(id: string): Promise<void> {
    return this.profilesRepository.remove(id);
  }
}