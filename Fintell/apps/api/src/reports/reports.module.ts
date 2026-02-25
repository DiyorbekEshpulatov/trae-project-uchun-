// @ts-nocheck
// Mock NestJS decorator
const Module = (options: any) => (target: any) => {};

import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}