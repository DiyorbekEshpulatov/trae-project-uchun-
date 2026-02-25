// Mock NestJS modules for TypeScript
export * from '@nestjs/common';
export * from '@nestjs/core';
export * from '@nestjs/platform-express';
export * from '@nestjs/jwt';
export * from '@nestjs/passport';
export * from '@nestjs/config';

// Mock types
declare module '@nestjs/common' {
  export interface ControllerOptions {}
  export interface InjectableOptions {}
  export interface ModuleOptions {}
  export interface ValidationPipeOptions {}
  export interface CanActivate {}
  export interface ExecutionContext {}
  
  export function Controller(path?: string): ClassDecorator;
  export function Injectable(): ClassDecorator;
  export function Module(options: ModuleOptions): ClassDecorator;
  export function Get(path?: string): MethodDecorator;
  export function Post(path?: string): MethodDecorator;
  export function Put(path?: string): MethodDecorator;
  export function Delete(path?: string): MethodDecorator;
  export function Body(): ParameterDecorator;
  export function Param(name?: string): ParameterDecorator;
  export function Query(): ParameterDecorator;
  export function UseGuards(...guards: any[]): MethodDecorator & ClassDecorator;
  export function UseInterceptors(...interceptors: any[]): MethodDecorator & ClassDecorator;
  export function ValidationPipe(options?: ValidationPipeOptions): any;
  export function HttpException(message: string, status: number): any;
  export function UnauthorizedException(message?: string): any;
  export function BadRequestException(message?: string): any;
  export function NotFoundException(message?: string): any;
  export function ConflictException(message?: string): any;
  
  export const HttpStatus: {
    OK: number;
    CREATED: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    NOT_FOUND: number;
    CONFLICT: number;
    INTERNAL_SERVER_ERROR: number;
  };
}

declare module '@nestjs/core' {
  export class NestFactory {
    static create(module: any): any;
  }
  export interface INestApplication {
    useGlobalPipes(pipe: any): void;
    enableCors(options?: any): void;
    listen(port: number, callback?: () => void): Promise<void>;
  }
}

declare module '@nestjs/jwt' {
  export interface JwtModuleOptions {
    secret?: string;
    signOptions?: {
      expiresIn?: string;
    };
  }
  
  export class JwtService {
    constructor(options?: JwtModuleOptions);
    sign(payload: any): string;
    verify(token: string): any;
  }
}

declare module '@nestjs/passport' {
  export interface AuthGuardOptions {}
  export function AuthGuard(strategy?: string): any;
}

declare module '@nestjs/config' {
  export class ConfigModule {
    static forRoot(): any;
  }
  export interface ConfigService {
    get(key: string): string;
  }
}