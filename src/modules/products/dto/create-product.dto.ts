import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  quantity: number;

  @IsNotEmpty({ message: 'Hình ảnh không được để trống' })
  image: string;

  @IsNotEmpty({ message: 'Thương hiệu không được để trống' })
  brand: string;

  @IsNotEmpty({ message: 'Category ID không được để trống' })
  @IsMongoId({ message: 'Category ID phải là một MongoId hợp lệ' })
  categoryId: string;
}
