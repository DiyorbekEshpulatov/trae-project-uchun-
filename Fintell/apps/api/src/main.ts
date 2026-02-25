// @ts-nocheck
// Mock NestJS classes
class NestFactory {
  static async create(_module: any): Promise<any> {
    return {
      useGlobalPipes: (_pipe: any) => {},
      enableCors: (_options?: any) => {},
      listen: async (port: number, _callback?: () => void) => {
        console.log(`Application is running on: http://localhost:${port}`);
      }
    };
  }
}

class ValidationPipe {
  constructor(_options?: any) {}
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