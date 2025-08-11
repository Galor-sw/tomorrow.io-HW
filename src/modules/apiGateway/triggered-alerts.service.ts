import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { TriggeredAlertsRepo } from '../dal/repos/triggered.repo';

@Injectable()
export class TriggeredAlertsService {
  constructor(private readonly triggeredAlertsRepo: TriggeredAlertsRepo) {}

  async findAll() {
    return this.triggeredAlertsRepo.findAll();
  }

  async findByAlertId(alertId: string) {
    return this.triggeredAlertsRepo.findByAlertId(new Types.ObjectId(alertId));
  }

  async findByUserId(userId: string) {
    return this.triggeredAlertsRepo.findByUserId(new Types.ObjectId(userId));
  }

  async findRecent(limit: number = 10) {
    return this.triggeredAlertsRepo.findRecent(limit);
  }
}
