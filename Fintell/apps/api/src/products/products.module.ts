// @ts-nocheck
// Mock NestJS decorator
const Module = (_options: any) => (_target: any) => {};

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}