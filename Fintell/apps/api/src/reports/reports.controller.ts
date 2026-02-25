// @ts-nocheck
// Mock NestJS decorators
const Controller = (path?: string) => (target: any) => {};
const Get = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const UseGuards = (...guards: any[]) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
const Request = () => (target: any, propertyKey: string, parameterIndex: number) => {};
const Query = () => (target: any, propertyKey: string, parameterIndex: number) => {};

import { ReportsService } from './reports.service';

// Mock guard - will be available after npm install
const JwtAuthGuard = {} as any;

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.reportsService.getDashboardData(req.user.companyId);
  }

  @Get('inventory')
  getInventoryReport(@Request() req) {
    return this.reportsService.getInventoryReport(req.user.companyId);
  }

  @Get('financial')
  getFinancialReport(@Request() req) {
    return this.reportsService.getFinancialReport(req.user.companyId);
  }
}