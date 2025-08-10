import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDoc } from '../schemas/alert.schema';

@Injectable()
export class AlertsRepo {
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
}
