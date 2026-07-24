import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboardData(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.dashboardService.getOverview(userId, { startDate, endDate });
  }

  @Get('trends')
  getTrends(
    @Query('userId') userId: string,
    @Query('months') months: number = 6,
  ): Promise<any> {
    return this.dashboardService.getIncomeExpenseTrends(userId, months);
  }

  @Get('categories')
  getCategoryBreakdown(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.dashboardService.getCategoryBreakdown(userId, { startDate, endDate });
  }

  @Get('financial-health')
  getFinancialHealth(@Query('userId') userId: string): Promise<any> {
    return this.dashboardService.getFinancialHealth(userId);
  }

  @Get('alerts')
  getAlerts(@Query('userId') userId: string): Promise<any> {
    return this.dashboardService.getAlerts(userId);
  }
}