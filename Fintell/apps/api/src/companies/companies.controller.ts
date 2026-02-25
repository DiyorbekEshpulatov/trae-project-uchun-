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