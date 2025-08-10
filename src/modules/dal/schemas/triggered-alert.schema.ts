import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TriggeredAlertDocument = HydratedDocument<TriggeredAlert>;

@Schema()
export class TriggeredAlert {
  @Prop({ required: true })
  alertId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  actualValue: number;

  @Prop({ required: true })
  threshold: number;

  @Prop({ default: Date.now })
  triggeredAt: Date;

  @Prop({ default: false })
  notificationSent: boolean;
}

export const TriggeredAlertSchema = SchemaFactory.createForClass(TriggeredAlert);
