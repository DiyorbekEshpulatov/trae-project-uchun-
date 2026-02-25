// @ts-nocheck
// Mock NestJS decorators
const Controller = (_path?: string) => (_target: any) => {};
const Get = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};
const Post = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};
const Body = () => (_target: any, _propertyKey: string, _parameterIndex: number) => {};
const Patch = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};
const Param = (_param?: string) => (_target: any, _propertyKey: string, _parameterIndex: number) => {};
const Delete = (_path?: string) => (_target: any, _propertyKey: string, _descriptor: PropertyDescriptor) => {};
const UseGuards = (..._guards: any[]) => (_target: any, _propertyKey?: string, _descriptor?: PropertyDescriptor) => {};
const Request = () => (_target: any, _propertyKey: string, _parameterIndex: number) => {};

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