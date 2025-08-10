import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TriggeredAlert, TriggeredAlertDocument } from '../schemas/triggered-alert.schema';

@Injectable()
export class TriggeredAlertsRepository {
  constructor(
    @InjectModel(TriggeredAlert.name)
    private triggeredAlertModel: Model<TriggeredAlertDocument>,
  ) {}

  async create(triggeredAlertData: Partial<TriggeredAlert>): Promise<TriggeredAlert> {
    const triggeredAlert = new this.triggeredAlertModel(triggeredAlertData);
    return triggeredAlert.save();
  }

  async findAll(): Promise<TriggeredAlert[]> {
    return this.triggeredAlertModel.find().exec();
  }

  async findById(id: string): Promise<TriggeredAlert> {
    return this.triggeredAlertModel.findById(id).exec();
  }

  async findPendingNotifications(): Promise<TriggeredAlert[]> {
    return this.triggeredAlertModel.find({ notificationSent: false }).exec();
  }
}
