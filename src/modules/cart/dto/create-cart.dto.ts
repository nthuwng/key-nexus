import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { Status } from '../schemas/cart.schema';

export class CreateCartDto {
  @IsNotEmpty({ message: 'ID người dùng không được để trống' })
  @IsMongoId({ message: 'UserId phải là một MongoId hợp lệ' })
  userId: mongoose.Schema.Types.ObjectId | string;

  @IsOptional()
  sum?: number;

  @IsOptional()
  total_price?: number;

  @IsOptional()
  @IsEnum(Status, {
    message: 'Status phải là ACTIVE hoặc CHECKED_OUT',
  })
  status?: string;
}
