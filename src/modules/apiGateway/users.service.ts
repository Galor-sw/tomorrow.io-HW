import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from '../dal/repos/users.repo';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserInterface } from '../dal/types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(dto: CreateUserDto) {
    // Check if user with this email already exists
    const existingUser = await this.usersRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(`User with email ${dto.email} already exists`);
    }

    const userData = {
      email: dto.email.toLowerCase(),
      name: dto.name,
      phone: dto.phone,
      isActive: true,
      role: 'user',
      alerts: [],
    };

    return this.usersRepo.create(userData);
  }

  async findAll() {
    return this.usersRepo.findAll();
  }

  async findById(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    // Check if user exists
    await this.findById(id);

    // If email is being updated, check for conflicts
    if (dto.email) {
      const existingUser = await this.usersRepo.findByEmail(dto.email);
      if (existingUser && (existingUser as any)._id.toString() !== id) {
        throw new ConflictException(`User with email ${dto.email} already exists`);
      }
    }

    const updateData: any = {};
    if (dto.email) updateData.email = dto.email.toLowerCase();
    if (dto.name) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;

    return this.usersRepo.update(id, updateData);
  }

  async delete(id: string) {
    const user = await this.findById(id);
    return this.usersRepo.delete(id);
  }

  async addAlertToUser(userId: string, alertId: Types.ObjectId) {
    await this.findById(userId); // Verify user exists
    return this.usersRepo.addAlertToUser(userId, alertId);
  }

  async removeAlertFromUser(userId: string, alertId: Types.ObjectId) {
    await this.findById(userId); // Verify user exists
    return this.usersRepo.removeAlertFromUser(userId, alertId);
  }
}
