import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/category/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  image: string;

  @Prop()
  brand: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  categoryId: Category | mongoose.Schema.Types.ObjectId | string;

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

export const ProductSchema = SchemaFactory.createForClass(Product);
