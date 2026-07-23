import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, BusinessResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto): Promise<BusinessResponseDto> {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  findAll(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<BusinessResponseDto>> {
    return this.businessesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BusinessResponseDto> {
    return this.businessesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessDto: Partial<CreateBusinessDto>): Promise<BusinessResponseDto> {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.businessesService.remove(id);
  }

  @Get(':id/summary')
  getSummary(@Param('id') id: string): Promise<any> {
    return this.businessesService.getSummary(id);
  }
}