import { Injectable, OnModuleInit } from '@nestjs/common';
import { ParametersRepo } from '../dal/repos/parameters.repo';
import { OPERATORS } from '../dal/types/alert.types';

@Injectable()
export class ParametersService implements OnModuleInit {
  constructor(private readonly parametersRepo: ParametersRepo) {}

  async onModuleInit() {
    // Seed parameters on startup if they don't exist
    await this.parametersRepo.seedParameters();
  }

  async findAll() {
    return this.parametersRepo.findAll();
  }

  async getCategories() {
    const parameters = await this.parametersRepo.findAll();
    const categories = [...new Set(parameters.map(p => p.category))];
    return categories.map(category => ({
      name: category,
      parameters: parameters.filter(p => p.category === category)
    }));
  }

  async getNumericParameters() {
    return this.parametersRepo.getNumericParameters();
  }

  async getCategoricalParameters() {
    return this.parametersRepo.getCategoricalParameters();
  }

  async getParameterNames() {
    return this.parametersRepo.getParameterNames();
  }

  async getOperators() {
    return OPERATORS;
  }
}
