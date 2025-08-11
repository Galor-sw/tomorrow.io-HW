import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ParameterDoc = HydratedDocument<Parameter>;

@Schema({ timestamps: true })
export class Parameter {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  displayName: string;

  @Prop({ required: true })
  category: 'temperature' | 'precipitation' | 'atmospheric' | 'wind' | 'clouds' | 'visibility' | 'weather';

  @Prop({ required: true })
  type: 'numeric' | 'categorical';

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  unit?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const ParameterSchema = SchemaFactory.createForClass(Parameter);

// Indexes
ParameterSchema.index({ name: 1 });
ParameterSchema.index({ category: 1 });
ParameterSchema.index({ type: 1 });
ParameterSchema.index({ isActive: 1 });
ParameterSchema.index({ sortOrder: 1 });
