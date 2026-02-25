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

import { CompaniesService } from './companies.service';

// Mock guard - will be available after npm install
const JwtAuthGuard = {} as any;

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: any) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: any) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}