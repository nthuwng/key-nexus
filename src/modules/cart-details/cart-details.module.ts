import { Module } from '@nestjs/common';
import { CartDetailsService } from './cart-details.service';
import { CartDetailsController } from './cart-details.controller';
import { CartDetail, CartDetailSchema } from './schemas/cart-detail.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartDetail.name, schema: CartDetailSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      ]),
  ],
  controllers: [CartDetailsController],
  providers: [CartDetailsService],
})
export class CartDetailsModule {}
