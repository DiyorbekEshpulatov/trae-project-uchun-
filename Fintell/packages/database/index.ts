// @ts-nocheck
// Mock Prisma exports until npm install completes

// Export mock Prisma service
export { PrismaService } from './src/prisma-mock';

// Mock Prisma Client types
export class PrismaClient {
  user: any;
  company: any;
  product: any;
  transaction: any;
  $connect(): Promise<void> { return Promise.resolve(); }
  $disconnect(): Promise<void> { return Promise.resolve(); }
}

// Mock Prisma types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  quantity: number;
  price: number;
  minQuantity: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}