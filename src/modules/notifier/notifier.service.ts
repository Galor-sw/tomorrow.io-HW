import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { TriggeredAlertsRepo } from '../dal/repos/triggered.repo';
import { AlertsRepo } from '../dal/repos/alerts.repo';
import { UsersRepository } from '../dal/repos/users.repo';

@Injectable()
export class NotifierService {
  private readonly logger = new Logger(NotifierService.name);

  constructor(
    private readonly triggeredAlertsRepo: TriggeredAlertsRepo,
    private readonly alertsRepo: AlertsRepo,
    private readonly usersRepo: UsersRepository
  ) {}

  async sendNotification(message: string) {
    console.log(`Notification: ${message}`);
  }

  async sendEmailForTriggeredAlert(triggeredAlertId: Types.ObjectId) {
    try {
      this.logger.log(`Starting email notification for triggered alert: ${triggeredAlertId}`);
      
      // Get the triggered alert data from DAL
      const triggeredAlert = await this.getTriggeredAlertFromDAL(triggeredAlertId);
      if (!triggeredAlert) {
        this.logger.error(`Triggered alert not found: ${triggeredAlertId}`);
        return;
      }

      // Get the alert data from DAL
      const alert = await this.getAlertFromDAL(triggeredAlert.alertId);
      if (!alert) {
        this.logger.error(`Alert not found for triggered alert: ${triggeredAlertId}`);
        return;
      }

      // Get the user email from DAL
      const user = await this.getUserFromDAL(alert.userId);
      if (!user || !user.email) {
        this.logger.error(`User or email not found for alert: ${alert._id}`);
        return;
      }

      // Send email
      await this.sendEmail(user.email, triggeredAlert, alert);
      
      // Update sentMessage.email.date in DAL
      await this.updateSentMessageDate(triggeredAlertId);
      
      this.logger.log(`Email sent successfully for triggered alert: ${triggeredAlertId}`);
      
    } catch (error) {
      this.logger.error(`Error sending email for triggered alert ${triggeredAlertId}:`, error.message);
    }
  }

  private async getTriggeredAlertFromDAL(triggeredAlertId: Types.ObjectId) {
    this.logger.log(`Getting triggered alert from DAL: ${triggeredAlertId}`);
    return await this.triggeredAlertsRepo.findById(triggeredAlertId);
  }

  private async getAlertFromDAL(alertId: Types.ObjectId) {
    this.logger.log(`Getting alert from DAL: ${alertId}`);
    return await this.alertsRepo.findById(alertId);
  }

  private async getUserFromDAL(userId: Types.ObjectId) {
    this.logger.log(`Getting user from DAL: ${userId}`);
    return await this.usersRepo.findById(userId.toString());
  }

  private async sendEmail(email: string, triggeredAlert: any, alert: any) {
    // TODO: Implement actual email service (SendGrid, AWS SES, etc.)
    // For now, simulate email sending
    const emailContent = this.createEmailContent(triggeredAlert, alert);
    
    this.logger.log(`📧 SENDING EMAIL to ${email}`);
    this.logger.log(`📧 Email Content: ${emailContent}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.log(`📧 Email sent successfully to ${email}`);
    console.log(`📧 EMAIL SENT to ${email}`);
  }

  private createEmailContent(triggeredAlert: any, alert: any) {
    return `🚨 WEATHER ALERT: ${alert.description}

📍 Location: ${alert.locationText}
🌡️ Condition: ${alert.parameter} ${alert.operator} ${alert.threshold} ${alert.units}
📊 Current Value: ${triggeredAlert.alertData.currentValue} ${alert.units}
⏰ Triggered: ${triggeredAlert.dateTriggered.toLocaleString()}

Stay safe and take necessary precautions!`;
  }

  private async updateSentMessageDate(triggeredAlertId: Types.ObjectId) {
    this.logger.log(`Updating sentMessage.email.date for triggered alert: ${triggeredAlertId}`);
    
    await this.triggeredAlertsRepo.updateSentMessageDate(triggeredAlertId, new Date());
    
    this.logger.log(`Updated sentMessage.email.date for triggered alert: ${triggeredAlertId}`);
  }
}
