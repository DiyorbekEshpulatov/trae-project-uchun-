// @ts-nocheck
// Mock NestJS decorator
const Injectable = () => (_target: any) => {
  // Injectable decorator implementation
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'SmartAccounting AI API is running!';
  }
}