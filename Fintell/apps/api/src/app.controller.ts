// @ts-nocheck
// NestJS decorators - will be available after npm install
const Controller = (path?: string) => (target: any) => {
  // Controller decorator implementation
};

const Get = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  // Get decorator implementation
};

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: Date } {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }
}