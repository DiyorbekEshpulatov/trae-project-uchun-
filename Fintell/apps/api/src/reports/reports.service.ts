// @ts-nocheck
// Mock NestJS decorator
const Injectable = () => (target: any) => {};

// Mock Prisma service
class PrismaService {
  product = {
    findMany: async (query: any) => [],
    count: async (query: any) => 0,
    groupBy: async (options: any) => []
  };
  transaction = {
    findMany: async (query: any) => [],
    count: async (query: any) => 0,
    aggregate: async (options: any) => ({ _sum: { amount: 0 } })
  };
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService = new PrismaService()) {}

  async getDashboardData(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
    });

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
    const lowStockProducts = products.filter(p => p.quantity < p.minQuantity).length;

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      recentProducts: products.slice(0, 5),
    };
  }

  async getInventoryReport(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  async getFinancialReport(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
    });

    const totalAssets = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);

    return {
      totalAssets,
      totalItems,
      averagePrice: totalAssets / totalItems || 0,
      products: products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        totalValue: p.quantity * p.price,
      })),
    };
  }
}