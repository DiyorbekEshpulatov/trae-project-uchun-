// @ts-nocheck
// Mock NestJS decorators
const Controller = (path?: string) => (target: any) => {};
const Get = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const Post = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const Body = () => (target: any, propertyKey: string, parameterIndex: number) => {};
const Patch = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const Param = (param?: string) => (target: any, propertyKey: string, parameterIndex: number) => {};
const Delete = (path?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const UseGuards = (...guards: any[]) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
const Request = () => (target: any, propertyKey: string, parameterIndex: number) => {};

import { ProductsService } from './products.service';

// Mock guard - will be available after npm install
const JwtAuthGuard = {} as any;

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: any, @Request() req) {
    return this.productsService.create(createProductDto, req.user.companyId);
  }

  @Get()
  findAll(@Request() req) {
    return this.productsService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.productsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any, @Request() req) {
    return this.productsService.update(id, updateProductDto, req.user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(id, req.user.companyId);
  }
}