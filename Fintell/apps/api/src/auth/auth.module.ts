// @ts-nocheck
// Mock NestJS decorators and modules
const Module = (_options: any) => (_target: any) => {};
const JwtModule = {
  register: (_options: any) => ({})
};
const PassportModule = {};

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Mock strategy - will be available after npm install
const JwtStrategy = {} as any;

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: (global as any).process?.env?.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}