// @ts-nocheck
// Mock NestJS decorator
const Injectable = () => (target: any) => {};

// Mock AuthGuard
class AuthGuard {
  constructor(strategy: string) {}
  canActivate(context: any): boolean {
    return true; // Mock implementation
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}