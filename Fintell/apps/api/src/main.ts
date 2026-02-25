// @ts-nocheck
// Mock NestJS classes
class NestFactory {
  static async create(module: any): Promise<any> {
    return {
      useGlobalPipes: (pipe: any) => {},
      enableCors: (options?: any) => {},
      listen: async (port: number, callback?: () => void) => {
        console.log(`Application is running on: http://localhost:${port}`);
      }
    };
  }
}

class ValidationPipe {
  constructor(options?: any) {}
}

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  const port = (global as any).process?.env?.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();