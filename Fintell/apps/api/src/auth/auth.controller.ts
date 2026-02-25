// @ts-nocheck
// Mock NestJS decorators
const Controller = (_path?: string) => (_target: any) => {};
const Post = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};
const UseGuards = (..._guards: any[]) => (_target: any, _propertyKey?: string, _descriptor?: PropertyDescriptor) => {};
const Request = () => (_target: any, _propertyKey: string, _parameterIndex: number) => {};
const Get = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};

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