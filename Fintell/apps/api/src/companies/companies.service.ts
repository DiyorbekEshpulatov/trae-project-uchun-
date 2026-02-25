// @ts-nocheck
// Mock NestJS decorators
const Injectable = () => (_target: any) => {};
class NotFoundException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

// Mock Prisma service
class PrismaService {
  company = {
    findMany: async () => [],
    findUnique: async (_query: any) => null,
    create: async (data: any) => ({ id: '1', ...data.data }),
    update: async (query: any) => ({ id: query.where.id, ...query.data }),
    delete: async (query: any) => ({ id: query.where.id })
  };
}

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService = new PrismaService()) {}

  async findAll() {
    return this.prisma.company.findMany();
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async create(data: any) {
    return this.prisma.company.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}