import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCartDetailDto {
  @IsNotEmpty({ message: 'ID giỏ hàng không được để trống' })
  @IsMongoId({ message: 'CartId phải là một MongoId hợp lệ' })
  cartId: mongoose.Schema.Types.ObjectId | string;

  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsMongoId({ message: 'ProductId phải là một MongoId hợp lệ' })
  productId: mongoose.Schema.Types.ObjectId | string;

  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  quantity: number;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;
}
