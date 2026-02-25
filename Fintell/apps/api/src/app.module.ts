// @ts-nocheck
// Mock NestJS decorators
const Module = (_options: any) => (_target: any) => {
  // Module decorator implementation
};

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Mock modules - will be properly imported after npm install
const AuthModule = {} as any;
const CompaniesModule = {} as any;
const ProductsModule = {} as any;
const ReportsModule = {} as any;
const DatabaseModule = {} as any;

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CompaniesModule,
    ProductsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}