// @ts-nocheck
// Mock NestJS decorator
const Injectable = () => (_target: any) => {};

// Mock AuthGuard
class AuthGuard {
  constructor(_strategy: string) {}
  canActivate(_context: any): boolean {
    return true; // Mock implementation
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}