// @ts-nocheck
// Mock Prisma Client for immediate use

export class PrismaClient {
  user = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (query: any) => ({ id: query.where.id, ...query.data }),
    delete: async (query: any) => ({ id: query.where.id }),
  };

  company = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (query: any) => ({ id: query.where.id, ...query.data }),
    delete: async (query: any) => ({ id: query.where.id }),
  };

  product = {
    findUnique: async () => null,
    findMany: async () => [],
    findFirst: async () => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (query: any) => ({ id: query.where.id, ...query.data }),
    delete: async (query: any) => ({ id: query.where.id }),
  };

  transaction = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (query: any) => ({ id: query.where.id, ...query.data }),
    delete: async (query: any) => ({ id: query.where.id }),
    count: async () => 0,
    aggregate: async () => ({ _sum: { amount: 0 } }),
    groupBy: async () => [],
  };

  async $connect() {
    console.log('Mock Prisma connected');
  }

  async $disconnect() {
    console.log('Mock Prisma disconnected');
  }
}

export const Prisma = {
  Client: PrismaClient
};

export default PrismaClient;