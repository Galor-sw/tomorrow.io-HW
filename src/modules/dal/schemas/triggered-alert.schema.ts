import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AlertParameter, Operator } from '../types/alert.types';

export type TriggeredAlertDoc = HydratedDocument<TriggeredAlert>;

@Schema({ timestamps: true, collection: 'triggeredAlerts' })
export class TriggeredAlert {
  @Prop({ type: Types.ObjectId, ref: 'Alert', required: true })
  alertId: Types.ObjectId;

  @Prop({ required: true })
  dateTriggered: Date;

  @Prop({ type: Object, required: true })
  alertData: {
    parameter: AlertParameter;
    operator: Operator;
    threshold: number;
    currentValue: number;
  };

  @Prop({ type: Object, default: {} })
  sentMessage: {
    email?: {
      sent: boolean;
      timeSent?: Date;
    };
    phone?: {
      sent: boolean;
      timeSent?: Date;
    };
  };
}

export const TriggeredAlertSchema = SchemaFactory.createForClass(TriggeredAlert);

// Indexes for efficient querying
TriggeredAlertSchema.index({ dateTriggered: -1 }); // Sort by latest first
TriggeredAlertSchema.index({ alertId: 1 });
TriggeredAlertSchema.index({ 'alertData.parameter': 1 });
