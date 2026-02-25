// @ts-nocheck
// Mock NestJS decorators
const Injectable = () => (target: any) => {};
class NotFoundException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

// Mock Prisma service
class PrismaService {
  product = {
    findMany: async (query: any) => [],
    findFirst: async (query: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (query: any) => ({ id: query.where.id, ...query.data }),
    delete: async (query: any) => ({ id: query.where.id })
  };
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService = new PrismaService()) {}

  async findAll(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
    });
  }

  async findOne(id: string, companyId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(data: any, companyId: string) {
    return this.prisma.product.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(id: string, data: any, companyId: string) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}