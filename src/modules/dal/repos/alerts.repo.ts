import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDoc } from '../schemas/alert.schema';
import { AlertParameter, Operator, Units } from '../types/alert.types';

@Injectable()
export class AlertsRepo {
  constructor(@InjectModel(Alert.name) private model: Model<AlertDoc>) {}

  create(data: Partial<Alert>) {
    return this.model.create(data);
  }

  findAll() {
    return this.model.find().lean();
  }

  findById(alertId: Types.ObjectId) {
    return this.model.findById(alertId).lean();
  }

  listAllByUser(userId: Types.ObjectId) {
    return this.model.find({ userId }).lean();
  }

  async updateAlertTriggerStatus(alertId: Types.ObjectId, newStatus: 'triggered' | 'not_triggered') {
    // Always update the date, but only change status if it's different
    const result = await this.model.updateOne(
      { _id: alertId },
      { 
        $set: { 
          triggerStatus: {
            status: newStatus,
            date: new Date()
          }
        } 
      }
    );
    
    // Return true if document was updated, false if no change needed
    return result.modifiedCount > 0;
  }

  async updateAlertTriggerStatuses(triggeredAlertIds: Types.ObjectId[], notTriggeredAlertIds: Types.ObjectId[]) {
    const currentDate = new Date();
    
    // Update triggered alerts - always update date
    if (triggeredAlertIds.length > 0) {
      const triggeredResult = await this.model.updateMany(
        { _id: { $in: triggeredAlertIds } },
        { 
          $set: { 
            triggerStatus: {
              status: 'triggered',
              date: currentDate
            }
          } 
        }
      );
      if (triggeredResult.modifiedCount > 0) {
        console.log(`${triggeredResult.modifiedCount} alerts updated to 'triggered' status`);
      }
    }
    
    // Update not triggered alerts - always update date
    if (notTriggeredAlertIds.length > 0) {
      const notTriggeredResult = await this.model.updateMany(
        { _id: { $in: notTriggeredAlertIds } },
        { 
          $set: { 
            triggerStatus: {
              status: 'not_triggered',
              date: currentDate
            }
          } 
        }
      );
      if (notTriggeredResult.modifiedCount > 0) {
        console.log(`${notTriggeredResult.modifiedCount} alerts updated to 'not_triggered' status`);
      }
    }
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
          alerts: {
            $push: {
              _id: '$_id',
              userId: '$userId',
              parameter: '$parameter',
              operator: '$operator',
              threshold: '$threshold',
              description: '$description',
              units: '$units',
              triggerStatus: '$triggerStatus',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          location: {
            locationText: '$_id.locationText',
            lat: '$_id.lat',
            lon: '$_id.lon'
          },
          alerts: 1,
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
  }
}
