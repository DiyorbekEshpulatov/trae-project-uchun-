// @ts-nocheck
// Mock NestJS decorator
const Module = (options: any) => (target: any) => {};

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}