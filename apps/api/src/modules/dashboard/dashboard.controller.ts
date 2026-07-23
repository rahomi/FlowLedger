import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@Query('userId') userId: string): Promise<any> {
    return this.dashboardService.getOverview(userId);
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