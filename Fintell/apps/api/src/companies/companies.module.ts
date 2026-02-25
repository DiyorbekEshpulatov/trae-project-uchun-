// @ts-nocheck
// Mock NestJS decorator
const Module = (_options: any) => (_target: any) => {};

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}