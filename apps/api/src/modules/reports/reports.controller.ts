import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('api/v1/reports')
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

  @Get('expense')
  generateExpenseReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('businessId') businessId?: string,
  ): Promise<any> {
    return this.reportsService.generateExpenseReport(startDate, endDate, businessId);
  }

  @Get('business/:id')
  generateBusinessReport(
    @Param('id') businessId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.reportsService.generateBusinessReport(businessId, startDate, endDate);
  }
}