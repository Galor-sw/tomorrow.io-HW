import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TriggeredAlert, TriggeredAlertDoc } from '../schemas/triggered-alert.schema';

@Injectable()
export class TriggeredAlertsRepo {
  private readonly logger = new Logger(TriggeredAlertsRepo.name);

  constructor(@InjectModel(TriggeredAlert.name) private model: Model<TriggeredAlertDoc>) {}

  create(data: Partial<TriggeredAlert>) {
    return this.model.create(data);
  }

  async saveTriggeredAlert(alert: any) {
    try {
      const triggeredAlertData = {
        alertId: alert._id,
        dateTriggered: new Date(),
        alertData: {
          parameter: alert.parameter,
          operator: alert.operator,
          threshold: alert.threshold,
          currentValue: alert.currentValue
        },
        sentMessage: {
          email: {
            sent: false
          },
          phone: {
            sent: false
          }
        }
      };

      await this.create(triggeredAlertData);
      this.logger.log(`Triggered alert saved to database for alert ID: ${alert._id}`);
    } catch (error) {
      this.logger.error(`Failed to save triggered alert: ${error.message}`);
    }
  }

  findAll() {
    return this.model.find()
      .populate('alertId', 'locationText lat lon parameter operator threshold description units userId createdAt')
      .sort({ dateTriggered: -1 })
      .lean();
  }

  findByAlertId(alertId: Types.ObjectId) {
    return this.model.find({ alertId })
      .populate('alertId', 'locationText lat lon parameter operator threshold description units userId createdAt')
      .sort({ dateTriggered: -1 })
      .lean();
  }

  findByUserId(userId: Types.ObjectId) {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'alerts',
          localField: 'alertId',
          foreignField: '_id',
          as: 'alert'
        }
      },
      {
        $unwind: '$alert'
      },
      {
        $match: {
          'alert.userId': userId
        }
      },
      {
        $sort: { dateTriggered: -1 }
      }
    ]);
  }

  findLatestByAlertId(alertId: Types.ObjectId) {
    return this.model.findOne({ alertId })
      .populate('alertId', 'locationText lat lon parameter operator threshold description units userId createdAt')
      .sort({ dateTriggered: -1 })
      .lean();
  }

  findRecent(limit: number = 50) {
    return this.model.find()
      .populate('alertId', 'locationText lat lon parameter operator threshold description units userId createdAt')
      .sort({ dateTriggered: -1 })
      .limit(limit)
      .lean();
  }
}
