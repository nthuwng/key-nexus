import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type CartDocument = HydratedDocument<Cart>;

export enum Status {
  Active = 'ACTIVE',
  CheckedOut = 'CHECKED_OUT',
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User | mongoose.Schema.Types.ObjectId | string;

  @Prop({ default: 0 })
  sum: number;

  @Prop({ default: 0 })
  total_price: number;

  @Prop({ default: Status.Active, enum: Status })
  status: Status;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
