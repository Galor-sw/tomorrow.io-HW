import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AlertsRepo } from '../dal/repos/alerts.repo';
import { TriggeredAlertsRepo } from '../dal/repos/triggered.repo';
import { WeatherService } from '../weather/weather.service';
import { AlertParameter, ALL_PARAMS, Operator, OPERATORS } from '../dal/types/alert.types';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly cronExpression = process.env.SCHEDULER_CRON_EXPRESSION || 'EVERY_5_MINUTES';

  constructor(
    private readonly alertsRepo: AlertsRepo,
    private readonly triggeredAlertsRepo: TriggeredAlertsRepo,
    private readonly weatherService: WeatherService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  onModuleInit() {
    console.log('🔧 SCHEDULER_DISABLED value:', process.env.SCHEDULER_DISABLED);
    console.log('🔧 SCHEDULER_CRON_EXPRESSION value:', process.env.SCHEDULER_CRON_EXPRESSION);
    console.log('🔧 Final cron expression:', this.getCronExpression());
    
    if (process.env.SCHEDULER_DISABLED === 'true') {
      console.log('⏸️  Scheduler is disabled via SCHEDULER_DISABLED=true');
      return;
    }
    
    this.logger.log('🚀 Starting scheduler...');
    
    try {
      const job = this.schedulerRegistry.getCronJob('handleCron');
      job.stop();
      this.logger.log('🛑 Stopped default cron job');
    } catch (error) {
      this.logger.log('ℹ️  No default cron job to stop');
    }

    const cronJob = new (require('cron').CronJob)(
      this.getCronExpression(),
      () => this.handleCron(),
      null,
      true
    );
    
    this.schedulerRegistry.addCronJob('dynamicHandleCron', cronJob);
    this.logger.log('✅ Scheduler started successfully');
  }

  private getCronExpression(): string {
    const envValue = process.env.SCHEDULER_CRON_EXPRESSION;
    const cronMap = {
      'EVERY_MINUTE': '0 * * * * *',
      'EVERY_5_MINUTES': '0 */5 * * * *',
      'EVERY_10_MINUTES': '0 */10 * * * *',
      'EVERY_30_MINUTES': '0 */30 * * * *',
      'EVERY_HOUR': '0 0 * * * *',
      'EVERY_DAY': '0 0 0 * * *',
      'EVERY_WEEK': '0 0 0 * * 0',
      'EVERY_MONTH': '0 0 0 1 * *'
    };
    return cronMap[envValue] || envValue;
  }

  async handleCron() {
    // Check if scheduler is disabled
    if (process.env.SCHEDULER_DISABLED === 'true') {
      return;
    }

    try {
      // Get all alerts grouped by location
      const groupedAlerts = await this.alertsRepo.findGroupedByLocation();
      
      if (groupedAlerts.length === 0) {
        return;
      }

      // Process each location group
      for (const location of groupedAlerts) {
        try {
          // Get weather data once per location
          const weatherData = await this.weatherService.getWeatherData(location.locationText);
          
          // Check all alerts for this location against the weather data
          const { triggered, notTriggered } = this.checkAlertsAgainstWeather(location.alerts, weatherData);
          
          if (triggered.length > 0) {
            console.log(`🚨 ALERT TRIGGERED: ${triggered.length} alerts triggered for ${location.locationText}:`);
            
            // Save triggered alerts to database
            for (const alert of triggered) {
              await this.triggeredAlertsRepo.saveTriggeredAlert(alert);
              
              const alertMessage = `  - ${alert.parameter} ${alert.operator} ${alert.threshold} (Current: ${alert.currentValue})`;
              console.log(alertMessage);
            }
          }
          
          // Update alert trigger statuses efficiently
          const triggeredIds = triggered.map(alert => alert._id);
          const notTriggeredIds = notTriggered.map(alert => alert._id);
          await this.alertsRepo.updateAlertTriggerStatuses(triggeredIds, notTriggeredIds);
          
        } catch (error) {
          this.logger.error(`Error processing location ${location.locationText}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Scheduler error: ${error.message}`);
    }
  }

  private checkAlertsAgainstWeather(alerts: any[], weatherData: any): { triggered: any[], notTriggered: any[] } {
    const triggeredAlerts = [];
    const notTriggeredAlerts = [];
    
    for (const alert of alerts) {
      try {
        const currentValue = weatherData.data.values[alert.parameter];
        
        if (currentValue === undefined || currentValue === null) {
          this.logger.warn(`Weather data missing for parameter: ${alert.parameter}`);
          notTriggeredAlerts.push(alert);
          continue;
        }
        
        const isTriggered = this.evaluateCondition(currentValue, alert.operator, alert.threshold);
        
        if (isTriggered) {
          triggeredAlerts.push({
            ...alert,
            currentValue: currentValue
          });
        } else {
          notTriggeredAlerts.push(alert);
        }
      } catch (error) {
        this.logger.error(`Error evaluating alert ${alert._id}: ${error.message}`);
        notTriggeredAlerts.push(alert);
      }
    }
    
    return { triggered: triggeredAlerts, notTriggered: notTriggeredAlerts };
  }

  private evaluateCondition(currentValue: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>':
        return currentValue > threshold;
      case '>=':
        return currentValue >= threshold;
      case '<':
        return currentValue < threshold;
      case '<=':
        return currentValue <= threshold;
      case '=':
        return currentValue === threshold;
      case '!=':
        return currentValue !== threshold;
      default:
        this.logger.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }
}
