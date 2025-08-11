import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userModel.find({ isActive: true }).exec();
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async addAlertToUser(userId: string, alertId: Types.ObjectId): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { alerts: alertId } },
      { new: true }
    ).exec();
  }

  async removeAlertFromUser(userId: string, alertId: Types.ObjectId): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { alerts: alertId } },
      { new: true }
    ).exec();
  }
}
