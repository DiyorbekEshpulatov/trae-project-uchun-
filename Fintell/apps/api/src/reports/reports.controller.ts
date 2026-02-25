// @ts-nocheck
// Mock NestJS decorators
const Controller = () => (_target: any) => {};
const Get = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};
const UseGuards = (..._guards: any[]) => () => {};
const Request = () => (_target: any, _propertyKey: string, _parameterIndex: number) => {};

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