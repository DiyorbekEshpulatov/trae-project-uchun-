// @ts-nocheck
// Mock NestJS decorators and services
const Injectable = () => (target: any) => {};
class UnauthorizedException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

// Mock services - will be available after npm install
class JwtService {
  sign(payload: any): string {
    return 'mock-jwt-token';
  }
}

// Mock Prisma service
class PrismaService {
  user = {
    findUnique: async (query: any) => null
  };
}

// Mock bcrypt
const bcrypt = {
  compare: async (password: string, hash: string) => false
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService = new PrismaService(),
    private jwtService: JwtService = new JwtService(),
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, companyId: user.companyId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }
}