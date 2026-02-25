// @ts-nocheck
// Mock JWT auth guard
export class JwtAuthGuard {
  canActivate(context: any): boolean {
    return true; // Mock implementation
  }
}