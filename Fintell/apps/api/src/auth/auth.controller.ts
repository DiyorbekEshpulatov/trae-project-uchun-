// @ts-nocheck
// Mock NestJS decorators
const Controller = (path?: string) => (target: any) => {};
const Post = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const UseGuards = (...guards: any[]) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
const Request = () => (target: any, propertyKey: string, parameterIndex: number) => {};
const Get = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};

import { AuthService } from './auth.service';

// Mock guards - will be available after npm install
const LocalAuthGuard = {} as any;
const JwtAuthGuard = {} as any;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}