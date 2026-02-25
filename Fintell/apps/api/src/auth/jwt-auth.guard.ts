// @ts-nocheck
// Mock JWT auth guard
export class JwtAuthGuard {
  canActivate(_context: any): boolean {
    return true; // Mock implementation
  }
}