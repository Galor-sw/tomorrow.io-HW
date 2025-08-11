import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AlertParameter, ALL_PARAMS, Operator, OPERATORS, Units } from '../types/alert.types';

export type AlertDoc = HydratedDocument<Alert>;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ trim: true, required: true })
  locationText: string;

  @Prop() lat?: number;
  @Prop() lon?: number;

  @Prop({ required: true, enum: ALL_PARAMS })
  parameter: AlertParameter;

  @Prop({ required: true, enum: OPERATORS })
  operator: Operator;

  @Prop({ required: true })
  threshold: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true, default: 'metric' })
  units?: Units;

  @Prop({
    type: {
      status: { type: String, enum: ['triggered', 'not_triggered'], default: 'not_triggered' },
      date: { type: Date, default: Date.now }
    },
    default: { status: 'not_triggered', date: new Date() }
  })
  triggerStatus: {
    status: 'triggered' | 'not_triggered';
    date: Date;
  };
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

// Useful indexes
AlertSchema.index({ userId: 1 });
AlertSchema.index({ locationText: 1 });
AlertSchema.index({ lat: 1, lon: 1 });
AlertSchema.index({ parameter: 1 });
AlertSchema.index({ 'triggerStatus.status': 1 });
AlertSchema.index({ 'triggerStatus.date': -1 });
