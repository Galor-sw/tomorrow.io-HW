import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotifierService {
  private readonly logger = new Logger(NotifierService.name);

  sendNotification(message: string) {
    this.logger.log(`Notification: ${message}`);
    // TODO: Implement actual notification logic (email, SMS, etc.)
  }
}
