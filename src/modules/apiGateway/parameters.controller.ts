import { Controller, Get } from '@nestjs/common';
import { ParametersService } from './parameters.service';

@Controller('api/parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Get()
  findAll() {
    return this.parametersService.findAll();
  }

  @Get('names')
  getParameterNames() {
    return this.parametersService.getParameterNames();
  }

  @Get('categories')
  getCategories() {
    return this.parametersService.getCategories();
  }

  @Get('numeric')
  getNumericParameters() {
    return this.parametersService.getNumericParameters();
  }

  @Get('categorical')
  getCategoricalParameters() {
    return this.parametersService.getCategoricalParameters();
  }
}
