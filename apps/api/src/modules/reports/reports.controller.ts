import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial-summary')
  generateFinancialSummary(
    @Query('accountId') accountId: string,
    @Query('accountType') accountType: 'personal' | 'business',
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.reportsService.generateFinancialSummary(accountId, accountType, startDate, endDate);
  }

  @Get('cash-flow')
  generateCashFlowReport(
    @Query('accountId') accountId: string,
    @Query('accountType') accountType: 'personal' | 'business',
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.reportsService.generateCashFlowReport(accountId, accountType, startDate, endDate);
  }

  @Get('tax')
  generateTaxReport(
    @Query('accountId') accountId: string,
    @Query('accountType') accountType: 'personal' | 'business',
    @Query('year') year: number,
  ): Promise<any> {
    return this.reportsService.generateTaxReport(accountId, accountType, year);
  }

  @Get('budget')
  generateBudgetReport(
    @Query('accountId') accountId: string,
    @Query('accountType') accountType: 'personal' | 'business',
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<any> {
    return this.reportsService.generateBudgetReport(accountId, accountType, month, year);
  }
}