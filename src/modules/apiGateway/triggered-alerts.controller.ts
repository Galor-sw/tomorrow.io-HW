import { Controller, Get, Param, Query } from '@nestjs/common';
import { TriggeredAlertsService } from './triggered-alerts.service';

@Controller('api/triggered-alerts')
export class TriggeredAlertsController {
  constructor(private readonly triggeredAlertsService: TriggeredAlertsService) {}

  @Get()
  findAll() {
    return this.triggeredAlertsService.findAll();
  }

  @Get('recent')
  findRecent(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.triggeredAlertsService.findRecent(limitNumber);
  }

  @Get('alert/:alertId')
  findByAlertId(@Param('alertId') alertId: string) {
    return this.triggeredAlertsService.findByAlertId(alertId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.triggeredAlertsService.findByUserId(userId);
  }
}
