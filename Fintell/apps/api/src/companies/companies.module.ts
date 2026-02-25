// @ts-nocheck
// Mock NestJS decorator
const Module = (options: any) => (target: any) => {};

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}