import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  @InjectModel(Product.name)
  private productModel: Model<ProductDocument>;

  async create(createProductDto: CreateProductDto, user: IUser) {
    const { name, price, quantity, image, brand, categoryId } =
      createProductDto;
    const newProduct = await this.productModel.create({
      name,
      price,
      quantity,
      image,
      brand,
      categoryId,
      createdBy: { _id: user._id, email: user.email },
    });
    return {
      id: newProduct._id,
      createdAt: newProduct.createdAt,
    };
  }

  async findAll(currentPage: string, limit: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.productModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID không hợp lệ`);
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new BadRequestException(`Không tìm thấy sản phẩm`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) {
      throw new BadRequestException(`Không tìm thấy sản phẩm`);
    }

    return this.productModel.findByIdAndUpdate(
      id,
      { ...updateProductDto, updatedBy: { _id: user._id, email: user.email } },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID không hợp lệ`);
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new BadRequestException(`Không tìm thấy sản phẩm`);
    }

    return await this.productModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
        deletedAt: new Date(),
        isDeleted: true,
      },
    );
  }
}
