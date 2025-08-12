import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserInterface } from '../types/user.types';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User implements UserInterface {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Alert' }] })
  alerts: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Useful indexes
UserSchema.index({ isActive: 1 });
UserSchema.index({ role: 1 });
