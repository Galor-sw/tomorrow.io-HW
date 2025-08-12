import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { AlertsRepo } from '../dal/repos/alerts.repo';
import { TriggeredAlertsRepo } from '../dal/repos/triggered.repo';
import { WeatherService } from '../weather/weather.service';
import { AlertParameter, ALL_PARAMS, Operator, OPERATORS } from '../dal/types/alert.types';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly cronExpression = process.env.SCHEDULER_CRON_EXPRESSION || CronExpression.EVERY_5_MINUTES;

  constructor(
    private readonly alertsRepo: AlertsRepo,
    private readonly triggeredAlertsRepo: TriggeredAlertsRepo,
    private readonly weatherService: WeatherService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  onModuleInit() {
    
    // Check if scheduler is disabled via environment variable
    if (process.env.SCHEDULER_DISABLED === 'true') {
      console.log('⏸️  Scheduler is disabled via SCHEDULER_DISABLED=true');
      return;
    }

    console.log('🚀 Starting scheduler...');

    // Stop the default cron job
    try {
      const job = this.schedulerRegistry.getCronJob('handleCron');
      job.stop();
      console.log('🛑 Stopped default cron job');
    } catch (error) {
      
    }

    // Start a new cron job with the environment variable
    const cronJob = new (require('cron').CronJob)(
      this.getCronExpression(),
      () => this.handleCron(),
      null,
      true
    );

    this.schedulerRegistry.addCronJob('dynamicHandleCron', cronJob);
    console.log('✅ Scheduler started successfully');
  }

  private getCronExpression(): string {
    const envValue = process.env.SCHEDULER_CRON_EXPRESSION;
    
    if (!envValue) {
      return CronExpression.EVERY_5_MINUTES;
    }

    // Map NestJS constants to actual cron expressions
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

  @Cron(CronExpression.EVERY_5_MINUTES) // This will be overridden
  async handleCron() {
    try {
      // Fetch alerts already grouped by location from MongoDB
      const groupedAlerts = await this.alertsRepo.findGroupedByLocation();
      
      // Process each location
      for (const group of groupedAlerts) {
        const { location, alerts, count } = group;
        
        try {
          // Fetch weather data once per location
          const weatherData = await this.weatherService.getWeatherData(location.locationText);
          
          // Check each alert against the weather data
          const { triggered, notTriggered } = this.checkAlertsAgainstWeather(alerts, weatherData);
          
          if (triggered.length > 0) {
            console.log(`🚨 ALERT TRIGGERED: ${triggered.length} alerts triggered for ${location.locationText}:`);
            
            // Save triggered alerts to database
            for (const alert of triggered) {
              await this.triggeredAlertsRepo.saveTriggeredAlert(alert);
              const alertMessage = `  - ${alert.description || alert.parameter} ${alert.operator} ${alert.threshold}`;
              console.log(alertMessage);
            }
          }
          
          // Update alert states in DAL
          const triggeredIds = triggered.map(alert => alert._id);
          const notTriggeredIds = notTriggered.map(alert => alert._id);
          await this.alertsRepo.updateAlertTriggerStatuses(triggeredIds, notTriggeredIds);
          
        } catch (weatherError) {
          console.error(`Failed to fetch weather data for ${location.locationText}: ${weatherError.message}`);
          
          // If it's a rate limit error, log it and continue
          if (weatherError.message.includes('429')) {
            console.error(`Rate limit exceeded for ${location.locationText}. Skipping this location.`);
          }
          
          // Continue with next location
        }
      }
      
    } catch (error) {
      console.error(`Error in scheduler cron job: ${error.message}`);
    }
  }

  private checkAlertsAgainstWeather(alerts: any[], weatherData: any): { triggered: any[], notTriggered: any[] } {
    const triggeredAlerts = [];
    const notTriggeredAlerts = [];
    const weatherValues = weatherData.data.values;
    
    for (const alert of alerts) {
      const { parameter, operator, threshold, description } = alert;
      
      // Validate parameter against enum
      if (!this.isValidParameter(parameter)) {
        continue;
      }
      
      // Validate operator against enum
      if (!this.isValidOperator(operator)) {
        continue;
      }
      
      // Get the current weather value for this parameter
      const currentValue = weatherValues[parameter];
      
      if (currentValue === undefined) {
        continue;
      }
      
      // Check if the alert condition is met
      const isTriggered = this.evaluateCondition(currentValue, operator, threshold);
      
      if (isTriggered) {
        triggeredAlerts.push({
          ...alert,
          currentValue,
          weatherData: weatherData.data
        });
      } else {
        notTriggeredAlerts.push(alert);
      }
    }
    
    return { triggered: triggeredAlerts, notTriggered: notTriggeredAlerts };
  }

  private isValidParameter(parameter: string): parameter is AlertParameter {
    return ALL_PARAMS.includes(parameter as AlertParameter);
  }

  private isValidOperator(operator: string): operator is Operator {
    return OPERATORS.includes(operator as Operator);
  }

  private evaluateCondition(currentValue: number, operator: Operator, threshold: number): boolean {
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
        return false;
    }
  }
}
