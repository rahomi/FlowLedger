import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto, LoanResponseDto, PaginatedResultDto } from '@finance-manager/dto';
import { PaginatedRequestDto } from '@finance-manager/dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto): Promise<LoanResponseDto> {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  findAll(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<LoanResponseDto>> {
    return this.loansService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LoanResponseDto> {
    return this.loansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanDto: Partial<CreateLoanDto>): Promise<LoanResponseDto> {
    return this.loansService.update(id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.loansService.remove(id);
  }

  @Get(':id/amortization')
  calculateAmortizationSchedule(@Param('id') id: string): Promise<any> {
    return this.loansService.calculateAmortizationSchedule(id);
  }
}