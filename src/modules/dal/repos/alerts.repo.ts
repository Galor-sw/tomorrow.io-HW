import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDoc } from '../schemas/alert.schema';
import { AlertParameter, Operator, Units } from '../types/alert.types';

@Injectable()
export class AlertsRepo {
  private readonly logger = new Logger(AlertsRepo.name);

  constructor(@InjectModel(Alert.name) private model: Model<AlertDoc>) {}

  create(data: Partial<Alert>) {
    return this.model.create(data);
  }

  findAll() {
    return this.model.find().lean();
  }

  listAllByUser(userId: Types.ObjectId) {
    return this.model.find({ userId }).lean();
  }

  findById(alertId: Types.ObjectId) {
    return this.model.findById(alertId).lean();
  }

  async deleteById(alertId: Types.ObjectId) {
    const result = await this.model.findByIdAndDelete(alertId);
    if (result) {
      this.logger.log(`Alert deleted successfully: ${alertId}`);
    }
    return result;
  }

  async updateAlertTriggerStatus(alertId: Types.ObjectId, newStatus: 'triggered' | 'not_triggered') {
    // Always update the date, but only change status if it's different
    const result = await this.model.updateOne(
      { _id: alertId },
      {
        $set: {
          'triggerStatus.status': newStatus,
          'triggerStatus.date': new Date()
        }
      }
    );
    return result;
  }

  async updateAlertTriggerStatuses(triggeredAlertIds: Types.ObjectId[], notTriggeredAlertIds: Types.ObjectId[]) {
    const results = [];

    // Update triggered alerts - always update date
    if (triggeredAlertIds.length > 0) {
      const triggeredResult = await this.model.updateMany(
        { _id: { $in: triggeredAlertIds } },
        {
          $set: {
            'triggerStatus.status': 'triggered',
            'triggerStatus.date': new Date()
          }
        }
      );

      if (triggeredResult.modifiedCount > 0) {
        this.logger.log(`${triggeredResult.modifiedCount} alerts updated to 'triggered' status`);
      }
      results.push(triggeredResult);
    }

    // Update not triggered alerts - always update date
    if (notTriggeredAlertIds.length > 0) {
      const notTriggeredResult = await this.model.updateMany(
        { _id: { $in: notTriggeredAlertIds } },
        {
          $set: {
            'triggerStatus.status': 'not_triggered',
            'triggerStatus.date': new Date()
          }
        }
      );

      if (notTriggeredResult.modifiedCount > 0) {
        this.logger.log(`${notTriggeredResult.modifiedCount} alerts updated to 'not_triggered' status`);
      }
      results.push(notTriggeredResult);
    }

    return results;
  }

  async findGroupedByLocation() {
    return this.model.aggregate([
      {
        $group: {
          _id: {
            locationText: '$locationText',
            lat: '$lat',
            lon: '$lon'
          },
          locationText: { $first: '$locationText' },
          lat: { $first: '$lat' },
          lon: { $first: '$lon' },
          alerts: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { locationText: 1 }
      }
    ]);
  }
}
