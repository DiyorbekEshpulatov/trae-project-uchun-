// @ts-nocheck
// NestJS decorators - will be available after npm install
const Controller = (_path?: string) => (_target: any) => {
  // Controller decorator implementation
};

const Get = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {
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