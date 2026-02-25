// @ts-nocheck
// Mock NestJS decorator
const Injectable = () => (target: any) => {
  // Injectable decorator implementation
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'SmartAccounting AI API is running!';
  }
}