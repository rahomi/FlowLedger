import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { CreatePersonalAccountDto, PersonalAccountResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Controller('personal-accounts')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  create(@Body() createPersonalAccountDto: CreatePersonalAccountDto): Promise<PersonalAccountResponseDto> {
    return this.personalService.create(createPersonalAccountDto);
  }

  @Get()
  findAll(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<PersonalAccountResponseDto>> {
    return this.personalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PersonalAccountResponseDto> {
    return this.personalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonalAccountDto: Partial<CreatePersonalAccountDto>): Promise<PersonalAccountResponseDto> {
    return this.personalService.update(id, updatePersonalAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.personalService.remove(id);
  }

  @Get(':id/summary')
  getSummary(@Param('id') id: string): Promise<any> {
    return this.personalService.getSummary(id);
  }
}