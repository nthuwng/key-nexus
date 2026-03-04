import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CartService {
  @InjectModel(Cart.name)
  private cartModel: Model<CartDocument>;

  async create(createCartDto: CreateCartDto, user: IUser) {
    const newCategory = await this.cartModel.create({
      ...createCartDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return {
      id: newCategory._id,
      createdAt: newCategory.createdAt,
    };
  }

  async findAll(currentPage: string, limit: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.cartModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.cartModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(
        population ? population : { path: 'userId', select: 'fullName email' },
      )
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

    const category = await this.cartModel.findById(id);

    if (!category) {
      throw new BadRequestException(`Không tìm thấy giỏ hàng`);
    }
    return category;
  }

  async update(id: string, updateCartDto: UpdateCartDto, user: IUser) {
    const existingCart = await this.cartModel.findById(id);
    if (!existingCart) {
      throw new BadRequestException(`Không tìm thấy giỏ hàng`);
    }

    return this.cartModel.findByIdAndUpdate(
      id,
      { ...updateCartDto, updatedBy: { _id: user._id, email: user.email } },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID không hợp lệ`);
    }

    const category = await this.cartModel.findById(id);

    if (!category) {
      throw new BadRequestException(`Không tìm thấy giỏ hàng`);
    }

    return await this.cartModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
        deletedAt: new Date(),
        isDeleted: true,
      },
    );
  }
}
