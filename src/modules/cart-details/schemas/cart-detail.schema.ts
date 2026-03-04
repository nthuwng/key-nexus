import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Cart } from 'src/modules/cart/schemas/cart.schema';
import { Product } from 'src/modules/products/schemas/product.schema';

export type CartDetailDocument = HydratedDocument<CartDetail>;

@Schema({ timestamps: true })
export class CartDetail {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Cart.name })
  cartId: Cart | mongoose.Schema.Types.ObjectId | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
  productId: Product | mongoose.Schema.Types.ObjectId | string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

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

export const CartDetailSchema = SchemaFactory.createForClass(CartDetail);
