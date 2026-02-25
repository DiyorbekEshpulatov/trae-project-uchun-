// @ts-nocheck
// Mock NestJS decorator
const Injectable = () => (target: any) => {};

// Mock passport strategy
class PassportStrategy {
  constructor(strategy: any) {
    // Mock implementation
  }
}

// Mock passport-jwt
const ExtractJwt = {
  fromAuthHeaderAsBearerToken: () => 'bearer'
};

const Strategy = class {
  constructor(options: any) {}
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (global as any).process?.env?.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      companyId: payload.companyId 
    };
  }
}