import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, ProfileResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<ProfileResponseDto>> {
    return this.profilesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProfileResponseDto> {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: Partial<CreateProfileDto>): Promise<ProfileResponseDto> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.profilesService.remove(id);
  }
}