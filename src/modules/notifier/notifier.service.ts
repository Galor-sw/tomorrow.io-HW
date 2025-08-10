import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifierService {
  sendNotification(message: string) {
    console.log(`Notification: ${message}`);
  }
}
