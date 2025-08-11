import { Types } from 'mongoose';

export interface UserInterface {
  _id?: Types.ObjectId;
  email: string;
  name: string;
  phone?: string;
  isActive: boolean;
  role: string;
  alerts: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
